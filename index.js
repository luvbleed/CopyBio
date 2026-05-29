import { findByName } from "@vendetta/metro";
import { after } from "@vendetta/patcher";
import { clipboard } from "@vendetta/metro/common";
import { showToast } from "@vendetta/ui/toasts";

let unpatch;

export default {
    onLoad: () => {
        // نبحث عن مكون البايو في كود ديسكورد 
        // (الأسماء ممكن تتغير مع تحديثات ديسكورد، لكن هذي أشهرها)
        const UserBio = findByName("UserBio") || findByName("UserProfileBiography");

        if (UserBio) {
            // نسوي حقن (Patch) بعد ما يترندر المكون
            unpatch = after("default", UserBio, (args, res) => {
                const user = args[0]?.user;
                const bioText = user?.bio; // نسحب نص البايو

                // إذا الشخص عنده بايو، نضيف خصائصنا
                if (bioText && res?.props) {
                    // 1. يخلي النص يقبل التحديد (Selectable)
                    res.props.selectable = true;

                    // 2. ينسخ النص مباشرة عند الضغط المطول ويطلع لك تنبيه (Toast)
                    res.props.onLongPress = () => {
                        clipboard.setString(bioText);
                        showToast("تم نسخ البايو بنجاح! 📋");
                    };
                }
            });
        } else {
            console.log("لم يتم العثور على مكون البايو (UserBio).");
        }
    },
    onUnload: () => {
        // عشان لما تطفي البلوقن من الإعدادات، يرجع كل شيء طبيعي
        if (unpatch) unpatch();
    }
};

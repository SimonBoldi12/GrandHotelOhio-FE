import { useState, useCallback } from "react";

export function useConfirm() {
    const [config, setConfig] = useState(null);

    const confirm = useCallback(({ title, message, confirmText, cancelText, confirmVariant }) => {
        return new Promise((resolve) => {
            setConfig({
                isOpen: true,
                title,
                message,
                confirmText,
                cancelText,
                confirmVariant,
                onConfirm: () => { setConfig(null); resolve(true); },
                onCancel: () => { setConfig(null); resolve(false); },
            });
        });
    }, []);

    return { confirm, config };
}
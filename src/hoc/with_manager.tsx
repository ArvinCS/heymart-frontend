import { useAuth } from "@/context/auth_context";
import { useRouter } from "next/navigation";
import { ComponentType, useEffect, useState } from "react";

const withManager = <T extends object>(Component: ComponentType<T>) => {
    return function WithManager(props: T) {
        const [loading, setLoading] = useState(true);
        const router = useRouter();
        const { user } = useAuth();

        useEffect(() => {
            if (user.role.toLowerCase() !== 'manager') {
                router.replace('/auth/login');
            }
            setLoading(false);
        }, []);

        return !loading ? <Component {...props} /> : <div></div>
    }
};

export default withManager;
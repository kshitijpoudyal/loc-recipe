import {AppRouterInstance} from "next/dist/shared/lib/app-router-context.shared-runtime";

export const redirectToHome = (router: AppRouterInstance) => {
    router.push("/");
};
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import type { ComponentProps } from "react";

type LoadingAbsoluteProps = ComponentProps<"div">;
export function LoadingAbsolute({ ...props }: LoadingAbsoluteProps) {
    return (
        <div
            {...props}
            className={cn(
                "absolute left-0 top-0 bg-black/60 z-[9999] w-full h-full flex items-center justify-center ",
                props.className
            )}
        >
            <Loader2 className="animate-spin text-white" />
        </div>
    );
}

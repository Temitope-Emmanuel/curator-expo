import { IToastProps as IShowToastProps } from "native-base"

export interface IToastProps  {
    show: (props: IShowToastProps) => any;
    close: (id: any) => void;
    closeAll: () => void;
    isActive: (id: any) => boolean;
}
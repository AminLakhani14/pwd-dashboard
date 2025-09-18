export interface PWDInitINTERFACE {
    isLoading: boolean;
    SDPdropdown:Array<ISDPdropdown>;
}

export interface ISDPdropdown {
    Selected: Boolean;
    Text: string;
    Value: string;
}

export interface IActionKeyValueData {
    payload: {
        key?: string,
        name?: string,
        value: any
    }
}
export interface IActionTabKeys {
    payload: string[]
}

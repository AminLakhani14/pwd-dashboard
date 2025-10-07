export interface PWDInitINTERFACE {
    isLoading: boolean;
    startDate:string,
    endDate:string,
    SDPdropdown:Array<any>;
    SDPdropdownValue: string;
    districtDropdown:Array<ISDPdropdown>;
    districtValue: string,
    centerDropdown: Array<ISDPdropdown>;
    centerValue: string,
    AllReport:Array<IReportDropdown>;
    FWCReport:Array<IReportDropdown>;
    MSUReport:Array<IReportDropdown>;
    RHSAReport:Array<IReportDropdown>;
    linearData: Array<any>;
    FWCOpenClose:Array<any>;
    MSUOpenClose:Array<any>;
    RHSAOpenClose:Array<any>;
    AllOpenClose:Array<any>;
    Allcount:string;
    MSUcount:string;
    RHSACount:string;
    FWCCount:string;
    openclose:Array<any>;
    FWCOpenCloseRecord:Array<any>;
    MSUOpenCloseRecord:Array<any>;
    RHSAOpenCloseRecord:Array<any>;
    ContraceptivesAlert:Array<any>;
    contraceptiveStock:Array<any>;
    attendanceRecord:Array<any>;
}

export interface ISDPdropdown {
    Selected: Boolean;
    Text: string;
    Value: string;
}

export interface IReportDropdown {
    SurveyorName: string;
    SurveyCount: number;
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

export interface Idropdown{
    value: string,
    label: string,
}
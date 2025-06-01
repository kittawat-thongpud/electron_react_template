type Statistic = {
        cpuUsage: number;
        ramUsage: number;
        storageUsage: number;
};

type StaticData = {
        totalStorage: number;
        cpuModel: string;
        totalMemoryGB: number;
};

type View = "CPU" | "RAM" | "STORAGE";
type FrameWindowAction = "CLOSE" | "MAXIMIZE" | "MINIMIZE";

type EvenPayloadMapping = {
    statistics: Statistic;
    getStaticData: StaticData;
    changeView: View;
    sendFrameAction: FrameWindowAction;
};

type UnsubscribeFunction = () => void;

interface Window {
    electron: {
        subscribeStatistics: (
            callback: (statistics: Statistic)=> void 
        )=> UnsubscribeFunction;

        getStaticData: () => Promise<StaticData>;

        subscribeChangeView: (
            callback: (view: View)=> void 
        )=> UnsubscribeFunction;

        sendFrameAction: (paylod: FrameWindowAction) => void;
    };
}
export declare enum RequestStatus {
    PENDING = "PENDING",
    APPROVED = "APPROVED",
    REJECTED = "REJECTED",
    USED = "USED"
}
export declare class TestRequest {
    id: string;
    userId: string;
    packageId: string;
    status: RequestStatus;
    createdAt: Date;
    updatedAt: Date;
}

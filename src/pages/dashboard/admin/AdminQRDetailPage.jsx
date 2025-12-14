import React from "react";
import Pagination from "../../../components/common/Pagination";
import Search from "../../../components/common/Search";
import ModalUpload from "../../../components/common/ModalUpload";
import { CirclePlus, Trash2, LockKeyhole, CloudUpload, Eye, MoreVertical, PencilLine, Users, UserCheck, UserX, UserPlus, QrCode, MessageSquareText, SquareCheckBig, CopyX } from "lucide-react";
import StatsCard from "../../../components/common/StatsCard";
import { useParams } from "react-router-dom";

const AdminQRDetailPage = () => {
    const { maNhanSu } = useParams();


    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold">Quản lý phiên điểm danh
            </h1>
            Phiên điểm danh – Giảng viên {maNhanSu}

        </div>
    );
};

export default AdminQRDetailPage;

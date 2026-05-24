import React, { useState } from "react";
import Pagination from "../../../components/common/Pagination";
import Search from "../../../components/common/Search";
import ModalUpload from "../../../components/common/ModalUpload";

import {
  CirclePlus,
  Trash2,
  LockKeyhole,
  CloudUpload,
  Eye,
  MoreVertical,
  PencilLine,
  Users,
  UserCheck,
  UserX,
  UserPlus,
  X, ArrowDown, ArrowUp, FileSpreadsheet, FilterX,
  CheckLine,
  Lock,
  File, Camera, FileSearchIcon,
  GitPullRequest,
  ArrowUpWideNarrow, Settings
} from "lucide-react";
import StatsCard from "../../../components/common/StatsCard";
const AdminDetailSurveyPage = () => {
  return (

    <div className="min-h-screen">
      <div className="bg-gray-50 p-1">
        <div className="mx-auto">
          {/* Header */}
          <div className="h-1 bg-[#153898] mb-6" />
          <div className="">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              <StatsCard
                title="Tổng"
                value="21,459"
                percent="(+29%)"
                positive={true}
                subtitle="câu hỏi đã tạo"
                icon={<Users className="w-6 h-6 text-purple-600" />}
                iconBg="bg-purple-100"
              />

              <StatsCard
                title="Học phần đã tạo"
                value="4567"
                percent="(+18%)"
                positive={true}
                subtitle="kỳ này"
                icon={<UserPlus className="w-6 h-6 text-green-600" />}
                iconBg="bg-green-100"
              />

              <StatsCard
                title="Đang mở"
                value="19,860"
                percent="(-14%)"
                positive={false}
                subtitle="số học phần"
                icon={<UserCheck className="w-6 h-6 text-rose-600" />}
                iconBg="bg-rose-100"
              />

              <StatsCard
                title="Đã khóa"
                value="237"
                percent="(+42%)"
                positive={true}
                subtitle="số học phần"
                icon={<UserX className="w-6 h-6 text-yellow-600" />}
                iconBg="bg-yellow-100"
              />
            </div>


          </div>
        </div>
      </div>
    </div>

  );
};

export default AdminDetailSurveyPage;

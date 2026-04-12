import axiosClient from '@api/axiosClient';
import { SURVEY_ENDPOINTS } from '@constants/endpoints';

class SurveyService {
  normalizeSurveyItem(item = {}) {
    const courseSection = item.courseSection || {};
    const scheduleTemplates = Array.isArray(courseSection.scheduleTemplates)
      ? courseSection.scheduleTemplates
      : [];
    const firstPersonnel = scheduleTemplates[0]?.personnel || {};
    const practiceGroup = item.practiceGroup || {};

    const semester = item.semester || courseSection.semester || '';
    const inferAcademicYear = () => {
      if (item.academic_year) return item.academic_year;
      if (item.year) return item.year;
      if (semester.includes('-')) {
        const [first, second] = semester.split('-');
        if (/^\d{4}$/.test(first) && /^\d$/.test(second)) {
          return `${first}-${Number(first) + 1}`;
        }
      }
      return '';
    };

    return {
      id: item.id,
      course_code: item.course_code || courseSection.code || '',
      course_name: item.course_name || courseSection.name || item.title || '',
      semester,
      academic_year: inferAcademicYear(),
      status: item.status || (item.is_active === true ? 'Active' : item.is_active === false ? 'Inactive' : ''),
      learning_form: item.learning_form || (item.practice_group_id || practiceGroup.id ? 'Thực hành' : 'Lý thuyết'),
      practical_group: item.practical_group || (practiceGroup.number_group != null ? String(practiceGroup.number_group) : ''),
      created_at: item.created_at || item.opens_at || '',
      end_at: item.end_at || item.closes_at || '',
      instructor_code: item.instructor_code || firstPersonnel.teacher_code || '',
      instructor: item.instructor || firstPersonnel.full_name || '',
      department: item.department || '',
      average_rating: item.average_rating ?? null,
    };
  }

  /**
   * lay khao sat da tao
   * @route GET /api/v1/survey
   * @query { page?, limit?, semester?, year?, course_section_id?, course_name?, personnel_code? }
   */
  async getAllSurvey(options = {}) {
    const {
      page = 1,
      limit = 10,
      semester,
      year,
      course_section_id,
      course_name,
      personnel_code,
    } = options;

    const params = {
      page,
      limit,
      semester,
      year,
      course_section_id,
      course_name,
      personnel_code,
    };

    Object.keys(params).forEach((key) => {
      if (params[key] === undefined || params[key] === null || params[key] === '') {
        delete params[key];
      }
    });

    try {
      const response = await axiosClient.get(SURVEY_ENDPOINTS.BASE, { params });

      const rawData = response?.data;
      const surveysSource =
        response?.data?.surveys ||
        response?.data?.data ||
        (Array.isArray(rawData) ? rawData : []);

      const surveys = Array.isArray(surveysSource)
        ? surveysSource.map((item) => this.normalizeSurveyItem(item))
        : [];

      const rawPagination =
        response?.data?.pagination ||
        response?.meta?.pagination ||
        response?.meta ||
        response?.pagination ||
        {};

      const normalizedPage = Number(
        rawPagination.page ?? rawPagination.currentPage ?? rawPagination.current_page ?? page
      ) || Number(page) || 1;
      const normalizedLimit = Number(
        rawPagination.limit ?? rawPagination.pageSize ?? rawPagination.page_size ?? limit
      ) || Number(limit) || 10;
      const normalizedTotal = Number(
        rawPagination.total ?? rawPagination.totalItems ?? rawPagination.total_items ?? rawPagination.count ?? 0
      ) || 0;
      const normalizedTotalPages = Number(
        rawPagination.totalPages ?? rawPagination.total_pages ?? rawPagination.pageCount
      ) || (normalizedTotal > 0 ? Math.ceil(normalizedTotal / normalizedLimit) : 1);

      const pagination = {
        page: normalizedPage,
        limit: normalizedLimit,
        total: normalizedTotal,
        totalPages: normalizedTotalPages,
      };

      return {
        success: response?.success ?? true,
        message: response?.message || '',
        data: Array.isArray(surveys) ? surveys : [],
        pagination,
      };
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getCourseSectionsWithSurveys(options = {}) {
    const {
      page = 1,
      limit = 10,
      courseCode,
      courseName,
      semester,
      surveyActive = 'null',
    } = options;

    const params = {
      page,
      limit,
      courseCode,
      courseName,
      semester,
      surveyActive,
    };

    Object.keys(params).forEach((key) => {
      if (params[key] === undefined || params[key] === null || params[key] === '') {
        delete params[key];
      }
    });

    try {
      const response = await axiosClient.get(SURVEY_ENDPOINTS.COURSE_SECTIONS, { params });

      const rows =
        response?.data?.data ||
        response?.data ||
        (Array.isArray(response) ? response : []);

      const rawPagination =
        response?.meta ||
        response?.data?.pagination ||
        response?.pagination ||
        {};

      const normalizedPage = Number(rawPagination.page ?? page) || Number(page) || 1;
      const normalizedLimit = Number(rawPagination.limit ?? limit) || Number(limit) || 10;
      const normalizedTotal = Number(rawPagination.total ?? rawPagination.count ?? 0) || 0;
      const normalizedTotalPages = Number(rawPagination.totalPages ?? rawPagination.total_pages ?? 0)
        || (normalizedTotal > 0 ? Math.ceil(normalizedTotal / normalizedLimit) : 1);

      return {
        success: response?.success ?? true,
        message: response?.message || '',
        data: Array.isArray(rows) ? rows : [],
        pagination: {
          page: normalizedPage,
          limit: normalizedLimit,
          total: normalizedTotal,
          totalPages: normalizedTotalPages,
        },
      };
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async autoCreateSurveysFromTemplates() {
    try {
      return await axiosClient.post(SURVEY_ENDPOINTS.BASE);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getSurveyById(surveyId) {
    try {
      const response = await axiosClient.get(SURVEY_ENDPOINTS.BY_ID(surveyId));
      return {
        success: response?.success ?? true,
        message: response?.message || '',
        data: response?.data || null,
      };
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async updateSurveyStatus(surveyIds = []) {
    try {
      return await axiosClient.put(SURVEY_ENDPOINTS.STATUS, {
        survey_id: surveyIds,
      });
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async updateSurveyInfo(surveyId, payload = {}) {
    try {
      return await axiosClient.put(SURVEY_ENDPOINTS.BY_ID(surveyId), payload);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async bulkCreateSurveysWithQuestionsExcel({ title, closes_at, targets, file }) {
    const formData = new FormData();
    formData.append('title', title);
    formData.append('closes_at', closes_at);
    formData.append('targets', JSON.stringify(targets || []));
    formData.append('file', file);

    try {
      return await axiosClient.post(
        SURVEY_ENDPOINTS.BULK_CREATE_WITH_QUESTIONS_EXCEL,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
    } catch (error) {
      throw this.handleError(error);
    }
  }

  handleError(error) {
    const message = error.response?.data?.message || error.message || 'Khong the tai danh sach khao sat';
    const formattedError = new Error(message);
    formattedError.status = error.response?.status || 500;
    formattedError.originalError = error;
    return formattedError;
  }
}

export default new SurveyService();
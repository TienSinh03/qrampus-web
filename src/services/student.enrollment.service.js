import axiosClient from '@api/axiosClient';

class StudentEnrollmentService {
  async getAllEnrollments(params = {}) {
    try {
      const response = await axiosClient.get('/api/v1/student-enrollments', { params });
      return response;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async createStudentEnrollmentByAdmin(payload) {
    try {
      const response = await axiosClient.post('/api/v1/student-enrollments', payload);
      return response;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async bulkCreateStudentEnrollments(enrollments = []) {
    try {
      const response = await axiosClient.post('/api/v1/student-enrollments/bulk', {
        enrollments,
      });
      return response;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async updateEnrollmentStatus(payload) {
    try {
      const response = await axiosClient.patch('/api/v1/student-enrollments/status', payload);
      return response;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  handleError(error) {
    if (error.response) {
      const message = error.response.data?.message || 'Đã xảy ra lỗi từ server';
      const apiError = new Error(message);
      apiError.status = error.response.status;
      apiError.data = error.response.data;
      return apiError;
    }

    if (error.request) {
      return new Error('Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng.');
    }

    return new Error(error.message || 'Đã xảy ra lỗi không xác định');
  }
}

export default new StudentEnrollmentService();

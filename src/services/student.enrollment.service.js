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

  handleError(error) {
    if (error.response) {
      const message = error.response.data?.message || 'Da xay ra loi tu server';
      const apiError = new Error(message);
      apiError.status = error.response.status;
      apiError.data = error.response.data;
      return apiError;
    }

    if (error.request) {
      return new Error('Khong the ket noi den server. Vui long kiem tra ket noi mang.');
    }

    return new Error(error.message || 'Da xay ra loi khong xac dinh');
  }
}

export default new StudentEnrollmentService();

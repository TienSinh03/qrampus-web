/**
 * Room Validation Rules and Messages
 */

export const VALIDATION_PATTERNS = {
  roomCode: /^[A-Za-z0-9.-]{1,20}$/,
  coordinate: /^-?\d+(\.\d+)?$/,
};

export const ERROR_MESSAGES = {
  room_code: {
    required: "Mã phòng không được để trống",
    invalid: "Mã phòng chỉ chứa chữ, số, dấu chấm và gạch ngang (tối đa 20 ký tự)",
    maxLength: "Mã phòng không được vượt quá 20 ký tự",
  },
  room_name: {
    required: "Tên phòng không được để trống",
    maxLength: "Tên phòng không được vượt quá 100 ký tự",
  },
  coordinates: {
    required: "Tọa độ không được để trống",
    invalidCount: "Phải có đúng 4 tọa độ",
    invalidFormat: "Tọa độ phải là số",
    invalidX: "Giá trị X phải nằm trong khoảng [-180, 180]",
    invalidY: "Giá trị Y phải nằm trong khoảng [-90, 90]",
  },
  description: {
    maxLength: "Mô tả không được vượt quá 500 ký tự",
  },
};

export const validateRoomCode = (value) => {
  if (!value?.trim()) return ERROR_MESSAGES.room_code.required;
  if (value.trim().length > 20) return ERROR_MESSAGES.room_code.maxLength;
  if (!VALIDATION_PATTERNS.roomCode.test(value.trim()))
    return ERROR_MESSAGES.room_code.invalid;
  return "";
};

export const validateRoomName = (value) => {
  if (!value?.trim()) return ERROR_MESSAGES.room_name.required;
  if (value.trim().length > 100) return ERROR_MESSAGES.room_name.maxLength;
  return "";
};

export const validateCoordinate = (coord, index) => {
  if (!coord) return `Tọa độ điểm ${index + 1}: Không được để trống`;
  
  const x = parseFloat(coord.x);
  const y = parseFloat(coord.y);
  
  if (isNaN(x) || isNaN(y)) {
    return `Tọa độ điểm ${index + 1}: ${ERROR_MESSAGES.coordinates.invalidFormat}`;
  }
  
  if (x < -180 || x > 180) {
    return `Tọa độ điểm ${index + 1}: ${ERROR_MESSAGES.coordinates.invalidX}`;
  }
  
  if (y < -90 || y > 90) {
    return `Tọa độ điểm ${index + 1}: ${ERROR_MESSAGES.coordinates.invalidY}`;
  }
  
  return "";
};

export const validateCoordinates = (coordinates) => {
  if (!coordinates || coordinates.length === 0) {
    return ERROR_MESSAGES.coordinates.required;
  }
  
  if (coordinates.length !== 4) {
    return ERROR_MESSAGES.coordinates.invalidCount;
  }
  
  for (let i = 0; i < coordinates.length; i++) {
    const error = validateCoordinate(coordinates[i], i);
    if (error) return error;
  }
  
  return "";
};

export const validateDescription = (value) => {
  if (value && value.length > 500) {
    return ERROR_MESSAGES.description.maxLength;
  }
  return "";
};

export const validateRoomForm = (formData) => {
  const errors = {};
  
  const roomCodeError = validateRoomCode(formData.room_code);
  if (roomCodeError) errors.room_code = roomCodeError;
  
  const roomNameError = validateRoomName(formData.room_name);
  if (roomNameError) errors.room_name = roomNameError;
  
  const coordinatesError = validateCoordinates(formData.coordinates);
  if (coordinatesError) errors.coordinates = coordinatesError;
  
  const descriptionError = validateDescription(formData.description);
  if (descriptionError) errors.description = descriptionError;
  
  return errors;
};

export default {
  validateRoomCode,
  validateRoomName,
  validateCoordinate,
  validateCoordinates,
  validateDescription,
  validateRoomForm,
  ERROR_MESSAGES,
  VALIDATION_PATTERNS,
};

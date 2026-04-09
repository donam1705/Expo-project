import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

// Lấy dimension nhỏ và lớn để tính toán không phụ thuộc vào tình trạng xoay ngang/dọc
const shortDimension = width < height ? width : height;
const longDimension = width < height ? height : width;

// Cấu hình Base Tablet (1920x1200 ở tỉ lệ rút gọn logic 2x => 960x600)
// Base width 600px đại diện cho chiều ngắn của thiết bị thiết kế gốc.
const guidelineBaseWidth = 600;
const guidelineBaseHeight = 960;

/**
 * Tỷ lệ scale tuyến tính theo chiều rộng thiết bị
 * (Thường dùng cho margin/padding ngang và fontSize nhỏ)
 */
export const scale = (size: number) => (shortDimension / guidelineBaseWidth) * size;

/**
 * Tỷ lệ scale tuyến tính theo chiều cao thiết bị
 * (Thường dùng cho margin/padding dọc)
 */
export const verticalScale = (size: number) => (longDimension / guidelineBaseHeight) * size;

/**
 * Scale điều tiết (moderate): Resize nhưng không quá gắt như `scale`. 
 * Factor mặc định là 0.5 (giảm 50% chênh lệch do màn to vỡ layout so với scale thuần).
 * Tốt nhất cho fontSize, icon dimensions, và border radius.
 */
export const moderateScale = (size: number, factor = 0.5) => size + (scale(size) - size) * factor;

export const ms = moderateScale;

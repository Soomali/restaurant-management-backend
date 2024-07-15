import mongoose from 'mongoose';
import { AuthorizationLevel } from './authenticable.schema';

export const MockCreateAuthenticableDTO = {
  email: 'mehmetaliguunaydin@gmail.com',
  phone_number: '+905428428571',
  password: '20013355149Ss.',
};

export const MockCustomerAuthenticableData = {
  _id: new mongoose.Types.ObjectId('64c242b3dd227a1cd7bb2d22'),

  email: 'mehmetaliguuunaydin@gmail.com',
  password: '$2b$10$Qp8LEXa2Tjor8HoTOOT9v.tsQ0Uq5ti1mtibo1FIIWENl7lP0vigy',
  refresh_tokens: [
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Im1laG1ldGFsaWd1dXVuYXlkaW5AZ21haWwuY29tIiwic3ViIjoiNjRjMjQyYjNkZDIyN2ExY2Q3YmIyZDIyIiwiaWF0IjoxNjkwNDUyNjU5LCJleHAiOjE2OTEwNTc0NTl9.bz8IqsFvUcS8Jc2RZutJtMpTG3F-_J5YYwHSdRG0NNk',
  ],
  phone_number: '+905528428571',

  is_verified: true,
  authorization_level: 0,
};

export const MockCompanyAuthenticableData = {
  _id: new mongoose.Types.ObjectId('64c2434ddd227a1cd7bb2d2d'),
  phone_number: '+905428428571',
  email: 'mehmetaliguunaydin@gmail.com',
  password: '$2b$10$CY6hNr9FZ4cdslKsMctK6.h.bFTL9DvL2hcJPd8x1Y5iQRu./heci',
  refresh_tokens: [
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Im1laG1ldGFsaWd1dW5heWRpbkBnbWFpbC5jb20iLCJzdWIiOiI2NGMyNDM0ZGRkMjI3YTFjZDdiYjJkMmQiLCJpYXQiOjE2OTA0NTI4MTMsImV4cCI6MTY5MTA1NzYxM30.8BvKBcKM0e4TcMIjtHSPFReJLSVSoAgzzNB65D-3R50',
  ],
  is_verified: true,
  authorization_level: 1,
  __v: 1,
};

export const MockCompanyRegistrationAuthenticableData = {
  _id: new mongoose.Types.ObjectId('64c2434ddd227a1cd7bb2d2f'),
  phone_number: '+905428428575',
  verification_code: '1234',
  email: 'registerCompany@gmail.com',
  password: '$2b$10$CY6hNr9FZ4cdslKsMctK6.h.bFTL9DvL2hcJPd8x1Y5iQRu./heci',
  refresh_tokens: [
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Im1laG1ldGFsaWd1dW5heWRpbkBnbWFpbC5jb20iLCJzdWIiOiI2NGMyNDM0ZGRkMjI3YTFjZDdiYjJkMmQiLCJpYXQiOjE2OTA0NTI4MTMsImV4cCI6MTY5MTA1NzYxM30.8BvKBcKM0e4TcMIjtHSPFReJLSVSoAgzzNB65D-3R50',
  ],
  is_verified: false,
  authorization_level: 1,
  __v: 1,
};

export const MockAdminAuthenticableData = {
  _id: new mongoose.Types.ObjectId('64c2434ddd227a1cd7bb2d2f'),
  phone_number: '+905428428575',
  verification_code: '1234',
  email: 'registerCompany@gmail.com',
  password: '$2b$10$CY6hNr9FZ4cdslKsMctK6.h.bFTL9DvL2hcJPd8x1Y5iQRu./heci',
  refresh_tokens: [
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Im1laG1ldGFsaWd1dW5heWRpbkBnbWFpbC5jb20iLCJzdWIiOiI2NGMyNDM0ZGRkMjI3YTFjZDdiYjJkMmQiLCJpYXQiOjE2OTA0NTI4MTMsImV4cCI6MTY5MTA1NzYxM30.8BvKBcKM0e4TcMIjtHSPFReJLSVSoAgzzNB65D-3R50',
  ],
  is_verified: false,
  authorization_level: AuthorizationLevel.admin,
  __v: 1,

}
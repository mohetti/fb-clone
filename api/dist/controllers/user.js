"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProfile = exports.deleteProfile = exports.getProfile = void 0;
const getProfile = (req, res, next) => {
    console.log('Get Profile');
    res.send('Get Profile');
};
exports.getProfile = getProfile;
const deleteProfile = (req, res, next) => {
    console.log('Delete Profile');
    res.send('Delete Profile');
};
exports.deleteProfile = deleteProfile;
const updateProfile = (req, res, next) => {
    console.log('Update Profile');
    res.send('Update Profile');
};
exports.updateProfile = updateProfile;

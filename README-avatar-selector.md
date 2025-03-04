# Avatar Selector Feature

This document provides an overview of the avatar selector feature implemented in the AI Chat Web App.

## Overview

The avatar selector allows users to personalize their profile by choosing from preset avatars or uploading their own image. The feature includes:

- 6 female and 6 male preset avatars from DiceBear Avataaars API
- Custom image upload with cropping functionality
- Drag-and-drop support for easy image uploading
- Seamless integration with the user profile
- Safe handling of large images
- Reliable file upload button implementation
- Comprehensive error handling and user feedback

## Implementation Details

### Components

1. **AvatarSelector Component**
   - Located at: `src/components/profile/AvatarSelector.tsx`
   - Provides a UI for selecting or uploading avatars
   - Handles image cropping for custom uploads
   - Includes safety measures for handling large images
   - Implements drag-and-drop functionality with browser event prevention
   - Uses direct button click handling for reliable file uploads
   - Provides visual feedback during all stages of the upload process

2. **Profile Component**
   - Located at: `src/pages/Profile.tsx`
   - Integrates the AvatarSelector component
   - Manages avatar state and updates
   - Handles persistence of avatar changes

3. **UserContext**
   - Located at: `src/contexts/UserContext.tsx`
   - Handles avatar persistence in localStorage
   - Provides methods for updating user profile data
   - Ensures avatar changes are preserved across sessions

### Dependencies

- **react-image-crop**: Used for the image cropping functionality
- **@radix-ui/react-dialog**: Used for the avatar selection modal
- **@radix-ui/react-tabs**: Used for organizing the avatar selection options
- **lucide-react**: Provides icons for the user interface

## Usage

1. Navigate to the Profile page
2. Click on your avatar to open the avatar selector
3. Choose from the following options:
   - Select a preset female avatar (first tab)
   - Select a preset male avatar (second tab)
   - Upload your own image by clicking "Choose File" or dragging and dropping an image (third tab)
4. For uploaded images:
   - Adjust the crop area to select the portion of the image you want to use
   - Click "Choose Another" to reset and select a different image
5. Click "Save" to apply your selection or "Cancel" to close without changes

## Technical Notes

- Custom uploaded avatars are stored as base64-encoded data URLs
- Preset avatars use the DiceBear Avataaars API
- The avatar selector is designed to be reusable in other parts of the application if needed
- Image uploads are limited to 5MB to prevent performance issues
- Large images are automatically resized to maintain usability
- The final avatar is standardized to 256x256 pixels for optimal performance
- Drag-and-drop functionality prevents the default browser behavior of opening files
- File input is triggered programmatically for better cross-browser compatibility
- The component uses React refs to directly manipulate DOM elements when necessary

## Safety Features

The avatar selector includes several safety measures to prevent issues with large images and improve usability:

1. **File Size Limit**: Images larger than 5MB are rejected with a clear error message
2. **File Type Validation**: Only JPEG and PNG images are accepted
3. **Automatic Resizing**: Large images (>1000px in any dimension) are automatically resized while maintaining aspect ratio
4. **Constrained Crop Area**: The crop interface has a maximum height to prevent overflow
5. **Reset Option**: Users can easily reset and choose another image if needed
6. **Error Handling**: Clear error messages for failed uploads or processing
7. **Optimized Output**: All avatars are standardized to 256x256 pixels and compressed for optimal performance
8. **Drag-and-Drop Prevention**: Custom event handlers prevent the browser from opening dragged files
9. **Visual Feedback**: The drop zone provides visual feedback when dragging files over it
10. **Robust File Handling**: Comprehensive error handling for file reading and processing
11. **Debug Logging**: Console logging for easier troubleshooting of upload issues
12. **State Management**: Proper state management to handle loading states and prevent UI issues

## Accessibility Features

- Keyboard navigation support for all interactive elements
- Proper ARIA attributes for screen readers
- Visual feedback for all interactive states
- Disabled states for buttons during processing
- Clear error messages for accessibility

## Future Enhancements

Potential improvements for the avatar selector feature:

- Add more preset avatar styles and customization options
- Implement avatar removal option to revert to default
- Add avatar filters or effects for creative customization
- Support for animated avatars (GIFs or Lottie animations)
- Integration with external avatar services like Gravatar
- Add webcam capture option for direct photo uploads
- Implement undo/redo functionality for crop adjustments
- Add accessibility improvements for screen readers

## Troubleshooting

If you encounter issues with the avatar selector:

1. Check the browser console for error messages
2. Ensure the image is under 5MB and in JPEG or PNG format
3. Try using a different browser if drag-and-drop isn't working
4. Clear browser cache if old avatars persist after changes 
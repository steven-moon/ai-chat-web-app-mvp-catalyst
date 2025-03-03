import React, { useState, useRef, useCallback, DragEvent } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload, Check, X, RefreshCw } from "lucide-react";
import ReactCrop, { Crop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

interface AvatarSelectorProps {
  currentAvatar?: string;
  userName: string;
  onAvatarChange: (avatarUrl: string) => void;
}

const AvatarSelector: React.FC<AvatarSelectorProps> = ({
  currentAvatar,
  userName,
  onAvatarChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("female");
  const [selectedAvatar, setSelectedAvatar] = useState<string | null>(null);
  
  // For custom upload
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isImageLoading, setIsImageLoading] = useState(false);
  const [imageError, setImageError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [crop, setCrop] = useState<Crop>({
    unit: '%',
    width: 80,
    height: 80,
    x: 10,
    y: 10,
  });
  const imageRef = useRef<HTMLImageElement | null>(null);
  const dropZoneRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Preset avatars
  const femaleAvatars = [
    "https://api.dicebear.com/6.x/avataaars/svg?seed=female1&gender=female",
    "https://api.dicebear.com/6.x/avataaars/svg?seed=female2&gender=female",
    "https://api.dicebear.com/6.x/avataaars/svg?seed=female3&gender=female",
    "https://api.dicebear.com/6.x/avataaars/svg?seed=female4&gender=female",
    "https://api.dicebear.com/6.x/avataaars/svg?seed=female5&gender=female",
    "https://api.dicebear.com/6.x/avataaars/svg?seed=female6&gender=female",
  ];
  
  const maleAvatars = [
    "https://api.dicebear.com/6.x/avataaars/svg?seed=male1&gender=male",
    "https://api.dicebear.com/6.x/avataaars/svg?seed=male2&gender=male",
    "https://api.dicebear.com/6.x/avataaars/svg?seed=male3&gender=male",
    "https://api.dicebear.com/6.x/avataaars/svg?seed=male4&gender=male",
    "https://api.dicebear.com/6.x/avataaars/svg?seed=male5&gender=male",
    "https://api.dicebear.com/6.x/avataaars/svg?seed=male6&gender=male",
  ];

  // Set up event listeners for drag and drop on the entire document when the dialog is open
  React.useEffect(() => {
    if (!isOpen) return;

    const handleDragOver = (e: DragEvent<Element> | any) => {
      e.preventDefault();
      e.stopPropagation();
      
      // If we're on the upload tab, show the drag indicator
      if (activeTab === "upload") {
        setIsDragging(true);
      }
    };

    const handleDragLeave = (e: DragEvent<Element> | any) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
    };

    const handleDrop = (e: DragEvent<Element> | any) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
      
      // Only process drops if we're on the upload tab
      if (activeTab === "upload") {
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
          processFile(e.dataTransfer.files[0]);
        }
      }
    };

    // Add event listeners to the document
    document.addEventListener('dragover', handleDragOver);
    document.addEventListener('dragleave', handleDragLeave);
    document.addEventListener('drop', handleDrop);

    // Clean up
    return () => {
      document.removeEventListener('dragover', handleDragOver);
      document.removeEventListener('dragleave', handleDragLeave);
      document.removeEventListener('drop', handleDrop);
    };
  }, [isOpen, activeTab]);

  // Process the uploaded file
  const processFile = (file: File) => {
    console.log("Processing file:", file.name, file.type, file.size);
    
    // Check file type
    if (!file.type.match('image/jpeg') && !file.type.match('image/png')) {
      setImageError("Please upload a JPG or PNG image.");
      return;
    }
    
    // Check file size (limit to 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setImageError("Image is too large. Please select an image under 5MB.");
      return;
    }
    
    setIsImageLoading(true);
    setImageError(null);
    
    const reader = new FileReader();
    reader.onload = () => {
      console.log("File loaded successfully");
      // Pre-load the image to get dimensions
      const img = new Image();
      img.onload = () => {
        console.log("Image dimensions:", img.width, "x", img.height);
        // If image is extremely large, resize it before displaying
        if (img.width > 1000 || img.height > 1000) {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          
          // Calculate new dimensions while maintaining aspect ratio
          let newWidth = img.width;
          let newHeight = img.height;
          
          if (img.width > img.height) {
            newWidth = 1000;
            newHeight = (img.height / img.width) * 1000;
          } else {
            newHeight = 1000;
            newWidth = (img.width / img.height) * 1000;
          }
          
          canvas.width = newWidth;
          canvas.height = newHeight;
          
          if (ctx) {
            ctx.drawImage(img, 0, 0, newWidth, newHeight);
            setUploadedImage(canvas.toDataURL('image/jpeg', 0.9));
          } else {
            setUploadedImage(reader.result as string);
          }
        } else {
          setUploadedImage(reader.result as string);
        }
        
        setIsImageLoading(false);
      };
      
      img.onerror = (error) => {
        console.error("Error loading image:", error);
        setImageError("Failed to load image. Please try another file.");
        setIsImageLoading(false);
      };
      
      img.src = reader.result as string;
    };
    
    reader.onerror = (error) => {
      console.error("Error reading file:", error);
      setImageError("Failed to read file. Please try again.");
      setIsImageLoading(false);
    };
    
    reader.readAsDataURL(file);
  };
  
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log("File input change event triggered");
    if (e.target.files && e.target.files.length > 0) {
      console.log("File selected:", e.target.files[0].name);
      processFile(e.target.files[0]);
    } else {
      console.log("No files selected");
    }
    
    // Reset the input value so the same file can be selected again if needed
    if (e.target) {
      e.target.value = '';
    }
  };
  
  const handleChooseFileClick = () => {
    console.log("Choose file button clicked");
    // Programmatically click the hidden file input
    if (fileInputRef.current) {
      fileInputRef.current.click();
    } else {
      console.error("File input reference is null");
    }
  };
  
  const resetUpload = () => {
    setUploadedImage(null);
    setImageError(null);
  };
  
  const getCroppedImg = () => {
    if (!imageRef.current || !uploadedImage) return null;
    
    const canvas = document.createElement('canvas');
    const scaleX = imageRef.current.naturalWidth / imageRef.current.width;
    const scaleY = imageRef.current.naturalHeight / imageRef.current.height;
    
    // Ensure the output is a reasonable size (256x256 is good for avatars)
    const outputSize = 256;
    canvas.width = outputSize;
    canvas.height = outputSize;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;
    
    // Draw the cropped image and resize it to our target size
    ctx.drawImage(
      imageRef.current,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      outputSize,
      outputSize
    );
    
    return canvas.toDataURL('image/jpeg', 0.9);
  };
  
  const handleSaveAvatar = () => {
    if (activeTab === "upload" && uploadedImage) {
      const croppedImage = getCroppedImg();
      if (croppedImage) {
        onAvatarChange(croppedImage);
      }
    } else if (selectedAvatar) {
      onAvatarChange(selectedAvatar);
    }
    
    setIsOpen(false);
    setUploadedImage(null);
    setSelectedAvatar(null);
    setImageError(null);
  };
  
  const handleCancel = () => {
    setIsOpen(false);
    setUploadedImage(null);
    setSelectedAvatar(null);
    setImageError(null);
  };

  // Handle tab change
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setImageError(null);
  };
  
  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <div className="relative group cursor-pointer">
            <Avatar className="h-24 w-24">
              <AvatarImage src={currentAvatar} alt={userName} />
              <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
                {userName.split(' ').map(name => name[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div className="absolute inset-0 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
              <Upload className="h-6 w-6 text-white" />
            </div>
          </div>
        </DialogTrigger>
        
        <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Change your avatar</DialogTitle>
          </DialogHeader>
          
          <Tabs defaultValue="female" value={activeTab} onValueChange={handleTabChange}>
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="female">Female</TabsTrigger>
              <TabsTrigger value="male">Male</TabsTrigger>
              <TabsTrigger value="upload">Upload</TabsTrigger>
            </TabsList>
            
            <TabsContent value="female" className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                {femaleAvatars.map((avatar, index) => (
                  <div 
                    key={index}
                    className={`relative cursor-pointer rounded-lg p-2 ${selectedAvatar === avatar ? 'ring-2 ring-primary' : 'hover:bg-muted'}`}
                    onClick={() => setSelectedAvatar(avatar)}
                  >
                    <Avatar className="h-16 w-16 mx-auto">
                      <AvatarImage src={avatar} alt={`Female avatar ${index + 1}`} />
                    </Avatar>
                    {selectedAvatar === avatar && (
                      <div className="absolute top-1 right-1 bg-primary rounded-full p-0.5">
                        <Check className="h-3 w-3 text-primary-foreground" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="male" className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                {maleAvatars.map((avatar, index) => (
                  <div 
                    key={index}
                    className={`relative cursor-pointer rounded-lg p-2 ${selectedAvatar === avatar ? 'ring-2 ring-primary' : 'hover:bg-muted'}`}
                    onClick={() => setSelectedAvatar(avatar)}
                  >
                    <Avatar className="h-16 w-16 mx-auto">
                      <AvatarImage src={avatar} alt={`Male avatar ${index + 1}`} />
                    </Avatar>
                    {selectedAvatar === avatar && (
                      <div className="absolute top-1 right-1 bg-primary rounded-full p-0.5">
                        <Check className="h-3 w-3 text-primary-foreground" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="upload" className="space-y-4">
              {!uploadedImage ? (
                <div 
                  ref={dropZoneRef}
                  className={`flex flex-col items-center justify-center p-6 border-2 ${isDragging ? 'border-primary border-dashed bg-primary/5' : 'border-dashed border-muted-foreground/25'} rounded-lg transition-colors`}
                >
                  <Upload className={`h-8 w-8 mb-2 ${isDragging ? 'text-primary' : 'text-muted-foreground'}`} />
                  <p className={`text-sm mb-2 ${isDragging ? 'text-primary' : 'text-muted-foreground'}`}>
                    {isDragging ? 'Drop your image here' : 'Upload a JPG or PNG image (max 5MB)'}
                  </p>
                  {imageError && (
                    <p className="text-sm text-red-500 mb-2">{imageError}</p>
                  )}
                  <input
                    type="file"
                    accept="image/jpeg, image/png"
                    className="hidden"
                    id="avatar-upload"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                  />
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm"
                    onClick={handleChooseFileClick}
                    disabled={isImageLoading}
                  >
                    {isImageLoading ? "Loading..." : "Choose File"}
                  </Button>
                  <p className="text-xs text-muted-foreground mt-2">
                    Or drag and drop an image here
                  </p>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <div className="max-h-[300px] overflow-hidden">
                    <ReactCrop
                      crop={crop}
                      onChange={(c) => setCrop(c)}
                      circularCrop
                      aspect={1}
                    >
                      <img 
                        src={uploadedImage} 
                        alt="Upload preview" 
                        ref={imageRef}
                        className="max-w-full max-h-[250px] object-contain"
                      />
                    </ReactCrop>
                  </div>
                  <div className="flex items-center justify-between w-full mt-4">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={resetUpload}
                      className="flex items-center"
                    >
                      <RefreshCw className="h-3 w-3 mr-2" />
                      Choose Another
                    </Button>
                    <p className="text-xs text-muted-foreground">
                      Drag to adjust the crop area
                    </p>
                  </div>
                </div>
              )}
            </TabsContent>
          </Tabs>
          
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={handleCancel}>
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button 
              onClick={handleSaveAvatar} 
              disabled={(!selectedAvatar && !uploadedImage) || isImageLoading}
            >
              <Check className="h-4 w-4 mr-2" />
              Save
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AvatarSelector; 
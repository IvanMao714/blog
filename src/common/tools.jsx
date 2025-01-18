
export const uploadImageByFile = (e) => {
    return uploadImage(e).then(url => {
        if(url) {
            return {
                success: 1,
                file: { url }
            }
        }
    })
}

export const uploadImageByURL = (e) => {
    let link = new Promise(( resolve, reject ) => {
        try {
            resolve(e)
        }
        catch(err) {
            reject(err)
        }
    })

    return link.then(url => {
        return {
            success: 1,
            file: { url }
        }
    })
}

// 图片上传逻辑
export const handleImageUpload = async (file) => {
    if (!file) return;
    let loadingToast = toast.loading("Uploading...");
    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_DOMAIN}/img/upload-image`,
        formData
      );
      toast.dismiss(loadingToast);
      toast.success("Uploaded 👍");
      return response.data.url;
    } catch (err) {
      toast.dismiss(loadingToast);
      console.error(err);
      toast.error("Upload failed");
      return null;
    }
  };


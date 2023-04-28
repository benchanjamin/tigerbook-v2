import {useDropzone} from 'react-dropzone';
import Image from 'next/image';
import {HeaderType} from "@types/types";

function ImageUpload({data, files, setFiles} : {data: HeaderType}) {
    const {getRootProps, getInputProps} = useDropzone({
        accept: {
            'image/*': []
        },
        maxFiles: 1,
        onDrop: acceptedFiles => {
            setFiles(acceptedFiles.map(file => Object.assign(file, {
                preview: URL.createObjectURL(file)
            })));
        }
    });

    const thumbs = files.map(file => (
        <div className="flex justify-center items-center w-full " key={file.name}>
            <div className="relative h-[200px] w-[200px]">
                <Image
                    src={file.preview}
                    onLoad={() => {
                        URL.revokeObjectURL(file.preview)
                    }}
                    fill
                    style={{objectFit: "cover"}}
                    alt={`Image of ${file.name}`}
                    className={`border-2 border-primary-100 dark:border-opacity-50 rounded-2xl`}
                />
            </div>
        </div>
    ));

    return (
        <form>
            <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
                <div className="sm:col-span-2">
                    <label htmlFor="name"
                           className="block mb-2 text-sm mt-4 mb-4 font-medium text-gray-900 dark:text-white">
                        {data.profile_pic_url !== null ?
                            'Upload Picture to Replace Your Current Above' :
                            'Upload Picture'}
                    </label>
                    <div className="flex items-center justify-center w-full">
                        <label htmlFor="dropzone-file"
                               className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                <p className="mb-2 text-sm text-gray-500 dark:text-gray-400 text-center"><span
                                    className="font-semibold">Click to upload a profile picture </span>
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400 text-center px-2">Upload an image
                                    type file (preferably cropped to a square image)</p>
                            </div>
                            <div {...getRootProps({className: 'dropzone'})}>
                                <input {...getInputProps()} id="dropzone-file" type="file"
                                       className="hidden"/>
                            </div>
                        </label>
                    </div>
                </div>
            </div>
            <div className="mt-2">
                <span className="text-sm font-medium text-gray-900 dark:text-white">{files.length > 0 && 'Preview'}</span>
            </div>
            <aside className="mt-10 mb-8">
                {thumbs}
            </aside>
        </form>

    );
}

export default ImageUpload;

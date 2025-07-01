// eslint-disable-next-line @typescript-eslint/no-explicit-any
import { Editor } from '@tinymce/tinymce-react'
import { forwardRef, useImperativeHandle, useRef } from 'react'
import { CLOUDINARY_CLOUD_NAME, CLOUDINARY_UPLOAD_PRESET } from 'src/constants/cloudinary'
// import type { Editor as TinyMCEEditor } from 'tinymce' // Not available, fallback to any

interface Props {
  initialValue?: string
}

export interface TinyMCERef {
  getContent: () => string
  setContent: (content: string) => void
}

const TinyMCECloudinary = forwardRef<TinyMCERef, Props>(({ initialValue = '' }, ref) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const editorRef = useRef<any>(null)

  // Hàm upload ảnh lên Cloudinary
  const handleImageUpload = (
    blobInfo: { blob: () => Blob },
    success: (url: string) => void,
    failure: (err: string) => void
  ) => {
    const formData = new FormData()
    formData.append('file', blobInfo.blob())
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET)

    return fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`, {
      method: 'POST',
      body: formData
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.secure_url) {
          success(data.secure_url)
        } else {
          failure('Upload failed')
        }
      })
      .catch(() => failure('Upload failed'))
  }

  // Expose getContent/setContent cho BlogForm dùng
  useImperativeHandle(ref, () => ({
    getContent: () => {
      return editorRef.current?.getContent() || ''
    },
    setContent: (content: string) => {
      if (editorRef.current) {
        editorRef.current.setContent(content)
      }
    }
  }))

  return (
    <Editor
      apiKey='3c01tpj99ifp8tl02qjoh4ug0cgoyc27x84qj97fezfnozqn'
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      onInit={(_evt: any, editor: any) => {
        editorRef.current = editor
      }}
      initialValue={initialValue}
      init={{
        plugins: [
          // Core editing features
          'anchor',
          'autolink',
          'charmap',
          'codesample',
          'emoticons',
          'image',
          'link',
          'lists',
          'media',
          'searchreplace',
          'table',
          'visualblocks',
          'wordcount',
          // Premium features (trial)
          'checklist',
          'mediaembed',
          'casechange',
          'formatpainter',
          'pageembed',
          'a11ychecker',
          'tinymcespellchecker',
          'permanentpen',
          'powerpaste',
          'advtable',
          'advcode',
          'editimage',
          'advtemplate',
          'ai',
          'mentions',
          'tinycomments',
          'tableofcontents',
          'footnotes',
          'mergetags',
          'autocorrect',
          'typography',
          'inlinecss',
          'markdown',
          'importword',
          'exportword',
          'exportpdf'
        ],
        toolbar:
          'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table mergetags | addcomment showcomments | spellcheckdialog a11ycheck typography | align lineheight | checklist numlist bullist indent outdent | emoticons charmap | removeformat',
        tinycomments_mode: 'embedded',
        tinycomments_author: 'Author name',
        mergetags_list: [
          { value: 'First.Name', title: 'First Name' },
          { value: 'Email', title: 'Email' }
        ],
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ai_request: (request: unknown, respondWith: any) =>
          respondWith.string(() => Promise.reject('See docs to implement AI Assistant')),
        images_upload_handler: handleImageUpload,
        file_picker_types: 'image',
        automatic_uploads: true,
        images_reuse_filename: true,
        content_style: `
          body { 
            font-family: 'Lato', Helvetica, Arial, sans-serif; 
            font-size: 16px; 
            direction: ltr !important; 
            text-align: left;
            line-height: 1.6;
          }
          * { direction: ltr; }
        `,
        text_direction: 'ltr',
        encoding: 'xml',
        relative_urls: false,
        remove_script_host: false,
        convert_urls: true
      }}
    />
  )
})

TinyMCECloudinary.displayName = 'TinyMCECloudinary'

export default TinyMCECloudinary

// Default
import React from 'react';

// Internal imports
import 'react-quill/dist/quill.snow.css'

// Third party
import ReactQuill from 'react-quill'
import PropTypes from 'prop-types'

/* 
 * Simple editor component that takes placeholder text as a prop 
 */
class Editor extends React.Component {
    constructor(props) {
        super()
    }

    

    render() {
        const { placeholder, editorHtml, handleChange, readOnly = false  } = this.props
        const styles = {
            paddingBottom : '20px',
            height: '60%'
        }

        return (
            <div style={styles}>
                <ReactQuill
                    theme='snow'
                    onChange={handleChange}
                    value={ editorHtml}
                    modules={Editor.modules}
                    formats={Editor.formats}
                    placeholder={placeholder}
                    readOnly ={readOnly}
                />
            </div>
        )
    }
}

/* 
 * Quill modules to attach to editor
 * See https://quilljs.com/docs/modules/ for complete options
 */
Editor.modules = {
    toolbar: [
        [{ 'header': '1' }, { 'header': '2' }, { 'font': [] }],
        [{ size: [] }],
        ['bold', 'italic', 'underline', 'strike', 'blockquote'],
        [{ 'list': 'ordered' }, { 'list': 'bullet' },
        { 'indent': '-1' }, { 'indent': '+1' }],
        ['link', 'image', 'video'],
        ['clean']
    ],
    clipboard: {
        // toggle to add extra line breaks when pasting HTML:
        matchVisual: false,
    }
}
/* 
 * Quill editor formats
 * See https://quilljs.com/docs/formats/
 */
Editor.formats = [
    'header', 'font', 'size',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent',
    'link', 'image', 'video'
]

/* 
 * PropType validation
 */
Editor.propTypes = {
    placeholder: PropTypes.string
}

export default Editor;
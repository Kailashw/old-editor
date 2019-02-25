import React from "react";
import {Button} from 'react-bootstrap'
import FileSaver from 'file-saver'

class DownloadButton extends React.Component {

  constructor(props) {
    super(props)
    this.state = {text: this.props.text, title: this.props.title, lang: this.props.lang}
  }

  fileNameify(name) {
    return name.split(" ").join("_")
  }
 
  componentWillReceiveProps(nextProps) {
    this.setState({text: nextProps.text, title: nextProps.title, lang: nextProps.lang})
  }

  saveCode(e) {
    e.preventDefault();
    const code = this.state.text;
    const blob = new Blob([code], {type: "text/plain;charset=utf-8"});
    FileSaver.saveAs(blob, `${this.fileNameify(this.state.title)}.html`);
  }

  render() {
    return (
      <Button className="btn-primary col-lg-12" onClick={this.saveCode.bind(this)}> Download </Button>
    )
  }
} 

export default DownloadButton


import React, { Fragment, useRef } from "react";
import SunEditor from "suneditor-react";
import "suneditor/dist/css/suneditor.min.css"; // Import Sun Editor's CSS File

const SunEditorComponent = ({
  width,
  height,
  placeholder,
  autofocus,
  setplugin,
  setcontent,
  appendcontent,
  defaultstyle,
  disable,
  hide,
  hidetoolbar,
  disabletoolbar,
  defaulContent,
  setoptions,
}) => {

  // Fix: Initialize useRef with null
  const editor = useRef(null); // Initialize with null

  // The sunEditor parameter will be set to the core suneditor instance when this function is called
  const getSunEditorInstance = (sunEditor) => {
    editor.current = sunEditor;
  };

  const handleChange = (content) => {
    console.log("Content changed:", content);
  };

  // Other event handlers...

  const editorOptions = {
    ...setoptions,  // Merge setoptions provided through props
  };

  return (
    <Fragment>
      <SunEditor
        setOptions={editorOptions}
        getSunEditorInstance={getSunEditorInstance}
        width={width}
        height={height}
        placeholder={placeholder}
        autoFocus={autofocus}
        setAllPlugins={setplugin}
        setContents={setcontent}
        appendContents={appendcontent}
        setDefaultStyle={defaultstyle}
        disable={disable}
        hide={hide}
        hideToolbar={hidetoolbar}
        disableToolbar={disabletoolbar}
        defaultValue={defaulContent}
        onChange={handleChange}
        // Other event handlers...
      />
    </Fragment>
  );
};

export default SunEditorComponent;

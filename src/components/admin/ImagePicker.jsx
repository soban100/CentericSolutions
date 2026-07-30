import { useRef, useState } from "react";
import { Upload, X } from "lucide-react";

export default function ImagePicker({ value, onChange, label = "Image", width = "100%", height = 160 }) {
  const inputRef = useRef(null);
  const [dragging, setDragging] = useState(false);

  const handleFile = (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => onChange(ev.target.result);
    reader.readAsDataURL(file);
  };

  const handleChange = (e) => handleFile(e.target.files?.[0]);

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    handleFile(e.dataTransfer.files?.[0]);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = () => setDragging(false);

  const clear = () => {
    onChange("");
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div>
      <label style={{ display: "block", fontSize: 12.5, fontWeight: 600, marginBottom: 4, color: "#10162A" }}>{label}</label>
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        style={{
          width, height, borderRadius: 10, border: dragging ? "2px dashed var(--primary)" : "1px solid #E4E1DA",
          background: value ? `center / contain no-repeat url("${value}")` : dragging ? "#F0EEFF" : "#F6F4F0",
          display: "flex", alignItems: "center", justifyContent: "center",
          position: "relative", overflow: "hidden", cursor: "pointer", transition: "border-color .2s, background .2s",
        }}
        onClick={() => !value && inputRef.current?.click()}
      >
        {!value && (
          <div style={{ textAlign: "center", color: dragging ? "var(--primary)" : "#9CA3AF", pointerEvents: "none" }}>
            <Upload size={22} style={{ margin: "0 auto 6px" }} />
            <span style={{ fontSize: 12.5, fontWeight: 500, display: "block" }}>
              {dragging ? "Drop image here" : `Upload ${label}`}
            </span>
            <span style={{ fontSize: 11, color: "#B0B7C3", marginTop: 4, display: "block" }}>or drag & drop</span>
          </div>
        )}
        {value && (
          <>
            <button type="button" onClick={(e) => { e.stopPropagation(); clear(); }} style={{
              position: "absolute", top: 6, right: 6, width: 28, height: 28, borderRadius: "50%",
              background: "rgba(0,0,0,.5)", border: "none", cursor: "pointer",
              color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 2,
            }}><X size={16} /></button>
            <button type="button" onClick={(e) => { e.stopPropagation(); inputRef.current?.click(); }} style={{
              position: "absolute", bottom: 6, right: 6, fontSize: 11, padding: "4px 10px",
              borderRadius: 6, background: "rgba(0,0,0,.5)", border: "none", cursor: "pointer",
              color: "#fff", fontFamily: "inherit", zIndex: 2,
            }}>Change</button>
          </>
        )}
        <input ref={inputRef} type="file" accept="image/*" onChange={handleChange} style={{ display: "none" }} />
      </div>
    </div>
  );
}

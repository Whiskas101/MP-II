import "./BrowsePlay.css";
import { useEffect, useRef, useState } from "react";
import { motion, useScroll } from "framer-motion";
import plus from "../../assets/plus-button.svg";
import { song } from "../../App";

type data = {
  data: playlist[];
  changeScreen: React.Dispatch<React.SetStateAction<string>>;
  changePlaylist: React.Dispatch<React.SetStateAction<song[]>>;
  setPlaylistData: React.Dispatch<React.SetStateAction<playlist[]>>
};

export type playlist = {
  name: string;
  url: string;
};

export default function BrowsePlay({ data, changeScreen, changePlaylist, setPlaylistData}: data) {
  const ref = useRef(null);
  const [formData, setFormData] = useState({
    name: "",
    url: "",
  });

 
  async function fetchAllPlaylists() {
    const data = await window.ipcRenderer.invoke("fetchAllPlaylists") 
    //Read userdata file and load every playlist written into it.   
    await setPlaylistData(data)
    console.log("Playlists: ",data);
    
    

  }

  



  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    console.log(formData);
  };

  const { scrollXProgress } = useScroll({ container: ref });
  // console.log(data)

  async function downloadPlaylist(URL: string, PlaylistName: string) {
    try {
      const data = await window.ipcRenderer.invoke(
        "downloadPlaylist",
        PlaylistName,
        URL
      );
      console.log(data);
    } catch (err) {
      console.log(
        "--------------------Between--------Dwnld-----------------------"
      );
      console.log(err);
    }
  }

  async function fetchSongs(playlist:string) {
    const data = await window.ipcRenderer.invoke(fetchSongs.name, playlist)
    console.log(data)
    return data
  }

  async function setPlaylist(name:any) {
    
    const data = await fetchSongs(name)
    changePlaylist(data)
    changeScreen("Player")
  }

  return (
    <>
      <motion.ul
        className="add-ul"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          duration: 0.8,
          delay: 0,
          ease: [0, 0.71, 0.2, 1.01],
        }}
        ref={ref}
      >
        <motion.li
          className="add-li"
          onPointerDownCapture={(e) => e.stopPropagation()}
          whileHover={{ scale: 1.1 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
          <button
            className="add-butt"
            onClick={() => {
              downloadPlaylist(formData.name, formData.url);
            }}
          >
            <img className="add-button" src={plus}></img>
          </button>
          <div className="add-data">
            <input
              className="txt-box"
              type="text"
              placeholder="Name"
              value={formData.name}
              onChange={handleInputChange}
              name="name"
            ></input>
            <input
              className="txt-box"
              type="text"
              placeholder="Url"
              value={formData.url}
              onChange={handleInputChange}
              name="url"
            ></input>
          </div>
        </motion.li>
        <button onClick={fetchAllPlaylists}>Refresh</button>
        {data.map((item, index) => (
          <motion.li
            key={index}
            whileHover={{ scale: 1.1 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
            onClick={()=>{setPlaylist(item.name)}}
          >
            {item.name}
          </motion.li>
        ))}
      </motion.ul>
    </>
  );
}

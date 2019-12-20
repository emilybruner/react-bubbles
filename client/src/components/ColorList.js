import React, { useState } from "react";
import axios from "axios";
import axiosWithAuth from "../utils/axiosWithAuth";

const initialColor = {
  color: "",
  code: { hex: "" }
};

const ColorList = ({ colors, updateColors }) => {
  console.log(colors);
  const [editing, setEditing] = useState(false);
  const [colorToEdit, setColorToEdit] = useState(initialColor);
  const [newColor, setNewColor] = useState({
    color: '',
    code: {hex: ''},
  })

  const editColor = color => {
    setEditing(true);
    setColorToEdit(color);
  };

  const saveEdit = e => {
    e.preventDefault();
    // Make a put request to save your updated color
    // think about where will you get the id from...
    // where is is saved right now?
    axiosWithAuth()
    .put(`http://localhost:5000/api/colors/${colorToEdit.id}`, colorToEdit)
    .then(res => {
      axiosWithAuth()
      .get(`http://localhost:5000/api/colors`)
      .then(response => {
        updateColors(response.data)
      })
      .catch(error => console.log('update get error', error))
    })
    .catch(error => console.log('update put error', error))

    setEditing(false);
  };

  const deleteColor = color => {

    axiosWithAuth()
    .delete(`http://localhost:5000/api/colors/${color.id}`)
    .then( res => 
      updateColors(colors.filter(color => {
        return color.id !== res.data
      })))
      .catch (error => console.log('delete error', error))
  };


const addColor = e => {
  axiosWithAuth()
  .post(`/api/colors`, newColor)
  .then(res => updateColors ([...colors, newColor]))
  .catch(error => console.log(error))
 
}

  return (
    <div className="colors-wrap">
      <p>colors</p>
      <ul>
        {colors.map(color => (
          <li key={color.color} onClick={() => editColor(color)}>
            <span>
              <span className="delete" onClick={e => {
                    e.stopPropagation();
                    deleteColor(color)
                  }
                }>
                  x
              </span>{" "}
              {color.color}
            </span>
            <div
              className="color-box"
              style={{ backgroundColor: color.code.hex }}
            />
          </li>
        ))}
      </ul>
      {editing && (
        <form onSubmit={saveEdit}>
          <legend>edit color</legend>
          <label>
            color name:
            <input
              onChange={e =>
                setColorToEdit({ ...colorToEdit, color: e.target.value })
              }
              value={colorToEdit.color}
            />
          </label>
          <label>
            hex code:
            <input
              onChange={e =>
                setColorToEdit({
                  ...colorToEdit,
                  code: { hex: e.target.value }
                })
              }
              value={colorToEdit.code.hex}
            />
          </label>
          <div className="button-row">
            <button type="submit">save</button>
            <button onClick={() => setEditing(false)}>cancel</button>
          </div>
        </form>
      )}
      <div className="spacer" />
      <form onSubmit={addColor}>
        <input
          type='text'
          name='color'
          value={newColor.color}
          onChange={(e) => {
            setNewColor({
              ...newColor,
              color: e.target.value
            })
          }}
          placeholder='Color Name'
          />
          
          />
          <input
            type='text'
            name='color'
            value={newColor.code.hex}
            onChange={(e) => {
              setNewColor({...newColor, code: {hex: e.target.value}})}}
            placeholder='hex code'
            />
            <button type='submit'>Add Color</button>
      </form>
    </div>
  );
};

export default ColorList;

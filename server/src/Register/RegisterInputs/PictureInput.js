import {useState} from 'react';


function PictureInput(props) {
    
    const [previewImage, setPreviewImage] = useState(null);
  

//     const handleImageChange = (event) => {
//         const file = event.target.files[0];
//         props.setImage(URL.createObjectURL(file));
//         console.log(props.image);
//   };


    
    const handleImageChange = (event) => {
      var file = event.target.files[0];
      var reader = new FileReader();

      reader.onload = function(event) {
        var base64Image = event.target.result;
        props.setImage(base64Image); // Update the state
      };
    
      reader.readAsDataURL(file);
    };
 
    //   props.setImage(URL.createObjectURL(event.target.files[0]));
    //   setPreviewImage(URL.createObjectURL(event.target.files[0]));  
    //   const reader = new FileReader();
    //   reader.onloadend = () => {
    //     setPreviewImage(reader.result);
    //   };
    //   reader.readAsDataURL(file);
    // };



    return(
        <>
        <div className = "row">
                <div className="col-md-8">
                    <div className="form-group row">
                        <label htmlFor="picture" className="col-sm-2 col-form-label">Picture:</label>
                        <div className="col-sm-10">
                        <input type="file" id="photo" className="form-control" name="photo" accept="image/*" ref={props.inputPicture}
                        onChange={handleImageChange}></input>
                        </div>
                    </div>
                </div>
            </div>
            <div className = "row">
                <div className="col-md-8">
                    <div className="form-group row">
                        
                    {props.image && (
                                        <img
                                            id="preview"
                                            src={props.image}
                                            alt="Preview of uploaded photo"/>
                                        )}
                        {/* <img id="preview" src={props.image} alt="Preview of uploaded photo" ></img> */}
                        </div>
                    </div>
                </div>  
        </>
    );
}



export default PictureInput;

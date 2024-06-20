import React from 'react'
import Post from './component/post/Post'

export default function App() {
   
  let post = [
    {
      id : 1,
      title : "Hello",
      image : " https://www.google.com/imgres?q=sieu%20nhan&imgurl=https%3A%2F%2Fstatic.tuoitre.vn%2Ftto%2Fi%2Fs626%2F2006%2F07%2F09%2F2qUHfh7T.jpg&imgrefurl=https%3A%2F%2Ftuoitre.vn%2Fkhi-sieu-nhan-tro-lai-149527.htm&docid=uPBjUvuxhCmlOM&tbnid=FisVwjBKwlPw8M&vet=12ahUKEwjuld7BxOaGAxWha2wGHS7VD2gQM3oECBwQAA..i&w=305&h=405&hcb=2&ved=2ahUKEwjuld7BxOaGAxWha2wGHS7VD2gQM3oECBwQAA",
      date :   "16/12/2004",
      status : true , 
    
    },
    {
      id : 2 ,
      title : "HI",
      image : " https://www.google.com/imgres?imgurl=https%3A%2F%2Fstatic.tuoitre.vn%2Ftto%2Fi%2Fs626%2F2006%2F07%2F09%2F2qUHfh7T.jpg&imgrefurl=https%3A%2F%2Ftuoitre.vn%2",
      date :   "16/12/2004",
      status : true ,

    },
    {
      id : 3,
      title : "Hello",
      image : " https://www.google.com/imgres?q=sieu%20nhan&imgurl=https%3A%2F%2Fstatic.tuoitre.vn%2Ftto%2Fi%2Fs626%2F2006%2F07%2F09%2F2qUHfh7T.jpg&imgrefurl=https%3A%2F%",
      date :   "16/12/2004",
      status : true ,
    }
  ]
  return (
    <div>
      <Post></Post>
    </div>
  )
}

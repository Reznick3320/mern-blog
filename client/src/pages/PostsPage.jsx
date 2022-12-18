import React, { useEffect, useState } from 'react'
import { PostItem } from '../components/PostItem';
import axios from '../utils/axios';

export const PostsPage = () => {
  const [posts, setPosts] = useState([]);

  const fetchMyPosts = async () => {
    try {
      const { data } = await axios.get('/posts/user/me')
      setPosts(data)
    } catch (e) {
      console.log(e);
    }
  }

  useEffect(() => {
    fetchMyPosts()
  }, [])
  return (
    <div className='w-1/2 mx-auto py-10 flex flex-col gap-10'>
      {posts?.map((post, id) => <PostItem post={post} key={id} />)}
    </div>
  )
}

import { supabase } from "./supabaseClient";

/////////////////////////////////////////////////////////////////////////////////////// posts
export async function fetchPosts() {
  try {
    const response = await supabase.from("posts").select(`*, comments(count), upvotes(count)`).order("created_at", {ascending: false});
    return response;
  } catch (error) {
    throw Error(error);
  }
}

export async function fetchPostsOrderByUpvotes() {
  try {
    const response = await supabase.from("posts").select(`*, upvotes(count)`);
    return response;
  } catch (error) {
    throw Error(error);
  }
}


export async function fetchPost(id) {
  try {
    const response = await supabase.from("posts").select().eq("id", id).maybeSingle();
    if (!response.data) {
      throw new Error('Post not found');
    }
    return response;
  } catch(error) {
    throw Error(error);
  }
}

export async function fetchCreatePost(newPost) {
  try {
    const response = await supabase.from("posts").insert(newPost).select();
    return response;
  } catch (error) {
    throw Error(error);
  }
}

export async function fetchUpdatePost(id, updatedPost) {
  try {
    const response = await supabase.from("posts").update(updatedPost).eq("id", id).select();
    return response;
  } catch (error) {
    throw Error(error);
  }
}

export async function fetchDeletePost(id) {
  try {
    const response = await supabase.from("posts").delete().eq("id", id);
    return response;
  } catch (error) {
    throw Error(error);
  }
}

export async function fetchDeleteCommentsOfPost(postId) {
  try {
    const response = await supabase.from("comments").delete().eq("post_id", postId);
    return response;
  } catch (error) {
    throw Error(error);
  }
}

export async function fetchDeleteUpvotesOfPost(postId) {
  try {
    const response = await supabase.from("upvotes").delete().eq("post_id", postId);
    return response;
  } catch (error) {
    throw Error(error);
  }
}

export async function fetchSearchByTitle(condition) {
  try {
    const response = await supabase.from('posts').select().textSearch('title', condition, {config: 'english'});
    return response;
  } catch (error) {
    throw Error(error);
  }
}

////////////////////////////////////////////////////////////////////////////////// comments
export async function fetchComments(postId) {
  try {
    const response = await supabase.from("comments").select().eq("post_id", postId).order('created_at', {ascending: false});
    return response;
  } catch (error) {
    throw Error(error);
  }
}

export async function fetchCreateComment(newComment) {
  try {
    const response = await supabase.from("comments").insert(newComment).select();
    return response;
  } catch (error) {
    throw Error(error);
  }
}

/////////////////////////////////////////////////////////////////////////////////// upvotes 
export async function fetchUpvotes(postId) {
  try {
    const response = await supabase.from("upvotes").select().eq("post_id", postId);
    return response;
  } catch (error) {
    throw Error(error);
  }
}

export async function fetchCreateUpvote(newUpvote) {
  try {
    const response = await supabase.from("upvotes").insert(newUpvote).select();
    return response;
  } catch (error) {
    throw Error(error);
  }
}

export async function fetchDeleteComment(id) {
  try {
    const response = await supabase.from("comments").delete().eq("id", id);
    return response;
  } catch (error) {
    throw Error(error);
  }
}

// creator
export async function fetchCreator(id) {
  try {
    const response = await supabase.from("creators").select().eq("id", id).maybeSingle();
    return response;
  } catch(error) {
    throw Error(error);
  }
}

export async function fetchLogout() {
  await supabase.auth.signOut();
}


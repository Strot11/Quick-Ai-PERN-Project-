import sql from "../configs/db.js";

export const getUserCreations = async (req, res) => {
  try {
    const { userId } = await req.auth();
    const creations =
      await sql`SELECT * FROM creations WHERE user_id = ${userId} ORDER BY created_at DESC`;
    res.json({ success: true, creations });
  } catch (err) {
    console.log(err.message);
    res.json({ success: false, message: err.message });
  }
};

export const getPublishCreations = async (req, res) => {
  try {
    const creations =
      await sql`SELECT * FROM creations WHERE publish = true ORDER BY created_at DESC`;
    res.json({ success: true, creations });
  } catch (err) {
    console.log(err.message);
    res.json({ success: false, message: err.message });
  }
};

export const toggleLikeCreations = async (req, res) => {
  try {
    const { userId } = await req.auth();
    const { id } = req.body;

    const [creation] = await sql`SELECT * FROM creations WHERE id = ${id}`;
    if (!creation) {
      return res.json({ success: false, message: "Creation not found" });
    }

    const currentLikes = creation.likes || [];
    const userIdStr = userId.toString();
    let message;

    if (currentLikes.includes(userIdStr)) {
      await sql`
        UPDATE creations 
        SET likes = array_remove(likes, ${userIdStr})
        WHERE id = ${id}
      `;
      message = "Like removed";
    } else {
      await sql`
        UPDATE creations 
        SET likes = array_append(likes, ${userIdStr})
        WHERE id = ${id}
      `;
      message = "Like added";
    }

    res.json({ success: true, message });
  } catch (err) {
    console.log(err.message);
    res.json({ success: false, message: err.message });
  }
};

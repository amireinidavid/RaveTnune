import { clerkClient } from "@clerk/express";

export const protectRoute = async (req, res, next) => {
  try {
    // Check if the userId exists in the request auth
    if (!req.auth || !req.auth.userId) {
      return res
        .status(200)
        .json({ message: "Unauthorized - you must be logged in" });
    }
    // Proceed to the next middleware
    next();
  } catch (error) {
    // Handle any unexpected errors
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const requireAdmin = async (req, res, next) => {
  try {
    const currentUser = await clerkClient.users.getUser(req.auth.userId);
    const isAdmin =
      process.env.ADMIN_EMAIL === currentUser.primaryEmailAddress?.emailAddress;

    if (!isAdmin) {
      return res
        .status(403)
        .json({ message: "Unauthorized - you must be an admin" });
    }

    next();
  } catch (error) {
    next(error);
  }
};

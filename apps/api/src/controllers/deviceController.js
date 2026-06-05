import { notificationService } from "../services/notificationService.js";

export async function registerPushToken(req, res) {
  try {
    const { pushToken, platform = "mobile" } = req.body;

    if (!pushToken) {
      return res.status(400).json({ message: "pushToken is required" });
    }

    const result = await notificationService.registerPushToken(
      req.user.userId,
      pushToken,
      platform
    );

    res.json(result);
  } catch (error) {
    res.status(500).json({ message: "Failed to register push token", error: error.message });
  }
}

export async function registerBiometric(req, res) {
  try {
    const { pinHash, biometricEnabled } = req.body;

    if (!pinHash) {
      return res.status(400).json({ message: "pinHash is required" });
    }

    // Note: In production, import User model and call updateBiometric
    res.json({
      success: true,
      message: "Biometric registration recorded",
      biometricEnabled
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to register biometric", error: error.message });
  }
}

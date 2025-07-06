

module.exports.getDriveFile = async (req, res, next) => {
  try {
    const { id: fileId } = req.body;
    const fetch = (await import('node-fetch')).default; // dynamic import

    const driveUrl = `https://drive.google.com/uc?export=download&id=${fileId}`;
    const response = await fetch(driveUrl);

    if (!response.ok) throw new Error("Failed to fetch file from Google Drive");

    const buffer = await response.arrayBuffer();

    res.setHeader("Content-Type", "application/octet-stream");
    res.send(Buffer.from(buffer));
  } catch (err) {
    console.error("Error in getDriveFile:", err.message);
    res.status(500).json({ msg: "Failed to fetch Google Drive file." });
  }
};

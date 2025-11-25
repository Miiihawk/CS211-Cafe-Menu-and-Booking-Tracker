import { Package } from "../models/Package";

export async function getAllPackages(req, res) {
  try {
    const packages = await Package.getAll();
    res.status(200).json(packages);
  } catch {
    res.sstatus(500).json({ message: error.message });
  }
}

export async function getPackageById(req, res) {
  try {
    const { id } = req.params;
    const packages = await Package.findById(id);

    if (!packages) {
      return res.status(404).json({ message: "Package not found" });
    }

    res.status(200).json(packages);
  } catch {
    res.status(500).json({ message: error.message });
  }
}

export async function updatePackage(req, res) {
  try {
    const { id } = req.params;
    const update = req.body;

    if (!updates || Object.keys(update).length === 0) {
      return res.status(400).json({ message: "no data provided" });
    }

    const result = await Package.update(id, updates);

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: "Package not found" });
    }

    if (result.modifiedCount === 0) {
      return res.status(200).json({ message: "No changes made" });
    }

    res.status(200).json({ message: "Updated successfully" });
  } catch {
    res.status(500).json({ message: error.message });
  }
}

export async function deletePackage(req, res) {
  try {
    const { id } = req.params;
    const result = await Package.delete(id);

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Package not found" });
    }

    res.status(200).json({ message: " Deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

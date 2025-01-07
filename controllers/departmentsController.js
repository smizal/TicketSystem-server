const Department = require("../models/departmentsModel");
const Ticket = require("../models/ticketsModel");

const index = async (req, res) => {
  try {
    const departments = "";
    if (req.user.role === "super") {
      departments = await Department.find();
    } else {
      departments = await Department.find({
        companyId: req.user.companyId,
      });
    }
    if (!departments) {
      return res.status(404).json({ error: "Bad request." });
    }
    res.status(200).json(departments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const create = async (req, res) => {
  try {
    if (req.user.role != "super") {
      req.body.companyId = req.user.companyId;
    }
    const department = await Department.create(req.body);
    if (!department) {
      return res.status(400).json({ error: "Error Saving Data." });
    }
    res.status(201).json(department);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const companyDepartments = async (req, res) => {
  try {
    const company = req.user.companyId;
    if (req.user.role === "super") {
      company = req.params.id;
    }
    const departments = await Department.find({ companyId: company });
    if (!departments) {
      return res.status(404).json({ error: "Bad request." });
    }
    res.status(200).json(departments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const show = async (req, res) => {
  try {
    const department = "";
    if (req.user.role === "super") {
      department = await Department.findById(req.params.id);
    } else {
      department = await Department.find({
        _id: req.params.id,
        companyId: req.user.companyId,
      });
    }
    if (!department) {
      return res.status(404).json({ error: "Bad request." });
    }
    res.status(200).json(department);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const update = async (req, res) => {
  try {
    const department = req.body;
    if (req.user.role === "super") {
      department = await Department.findByIdAndUpdate(req.params.id);
    } else {
      department = await Department.findOneAndUpdate({
        _id: req.params.id,
        companyId: req.user.companyId,
      });
    }
    if (!department) {
      return res.status(400).json({ error: "Error Saving Data." });
    }
    res.status(200).json(department);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const deleting = async (req, res) => {
  try {
    const department = null;
    const ticket = await Ticket.find({ departmentId: req.params.id });
    if (ticket) {
      if (req.user.role === "super") {
        department = await Department.findByIdAndUpdate(req.params.id, {
          status: "suspended",
        });
        if (!department) {
          return res.status(400).json({ error: "Bad request." });
        }
        return res
          .status(201)
          .json({ error: "Department has tickets. it is suspended only" });
      } else {
        department = await Department.findOneAndUpdate(
          {
            _id: req.params.id,
            companyId: req.user.companyId,
          },
          { status: "suspended" }
        );
        if (!department) {
          return res.status(400).json({ error: "Bad request." });
        } else {
          return res
            .status(201)
            .json({ error: "Department has tickets. it is suspended only" });
        }
      }
    }

    if (req.user.role === "super") {
      department = await Department.findByIdAndDelete(req.params.id);
    } else {
      department = await Department.findOneAndDelete({
        _id: req.params.id,
        companyId: req.user.companyId,
      });
    }
    if (!department) {
      return res.status(400).json({ error: "Bad request." });
    }
    res.status(200).json(department);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = { index, create, companyDepartments, show, update, deleting };

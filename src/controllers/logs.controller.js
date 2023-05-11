/* eslint-disable radix */
/* eslint-disable import/named */
import { Log } from '../database/models';

export const getLogById = async (req, res) => {
  try {
    const { id } = req.params;

    const log = await Log.findByPk(id, {
      include: 'user',
      attributes: { exclude: ['metadata'] },
    });

    if (!log) {
      return res.status(404).json({ message: 'Log not found' });
    }
    res.json(log);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllLogs = async (req, res) => {
  try {
    const totalCount = await Log.count();
    // eslint-disable-next-line radix
    const page = parseInt(req.query.page) || 1;
    // eslint-disable-next-line radix
    const limit = parseInt(req.query.limit) || totalCount;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const results = {};
    if (endIndex < totalCount) {
      results.next = {
        page: page + 1,
        limit,
      };
    }
    if (startIndex > 0) {
      results.previous = {
        page: page - 1,
        limit,
      };
    }
    // eslint-disable-next-line no-use-before-define
    results.results = await Log.findAll({
      limit,
      include: 'user',
      attributes: { exclude: ['metadata'] },
      offset: startIndex,
    });
    const allLogs = results;
    res.status(200).json(allLogs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const getUserLogs = async (req, res) => {
  try {
    const totalCount = await Log.count({ where: { userId: req.user.id } });
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || totalCount;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const results = {};
    if (endIndex < totalCount) {
      results.next = {
        page: page + 1,
        limit,
      };
    }
    if (startIndex > 0) {
      results.previous = {
        page: page - 1,
        limit,
      };
    }
    // eslint-disable-next-line no-use-before-define
    results.results = await Log.findAll({
      where: { userId: req.user.id },
      limit,
      include: 'user',
      attributes: { exclude: ['metadata'] },
      offset: startIndex,
    });
    const allLogs = results;
    res.status(200).json(allLogs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

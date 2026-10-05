const asyncHandler = require('../../../lib/asyncHandler');
const service = require('./budget.service');
const { sendSuccess } = require('../../../lib/response');

/**
 * Create a new budget
 */
exports.createBudget = asyncHandler(async (req, res) => {
  // console.log('Received request to create budget for user', req.user.id, 'with body', req.body);
  const budget = await service.createBudget(req.user.id, req.body);
  sendSuccess(res, 201, 'Budget created successfully', budget);
});

exports.deleteBudget = asyncHandler(async(req,res)=>{
  // console.log("deleteBudget id's",req.user.id,req.params.id);
  const budget = await service.deleteBudget(req.user.id, req.params.id);
  sendSuccess(res, 200, 'Budget deleted successfully', budget);
})
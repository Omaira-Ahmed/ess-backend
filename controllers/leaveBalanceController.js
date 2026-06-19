const model =
require(
"../models/leaveBalanceModel"
);

const logger =
require("../utils/logger");

const RESPONSE =
require("../utils/responseMessages");

const audit =
require("../utils/auditLogger");


// ================= GET BALANCE =================
const getBalance = async (req, res, next)=>{

try{

    const employee_id =
    parseInt(
    req.params.employee_id
    );

    if(
        isNaN(employee_id)
    ){
        logger.warn(
            `Invalid employee id: ${req.params.employee_id}`
        );

        return res
        .status(400)
        .json({

            message:
            RESPONSE.LEAVE_BALANCE.INVALID_EMPLOYEE_ID

        });

    }

    const balance =
    await model
    .getBalance(
        employee_id
    );

    res.status(200)
    .json({

        message:
        RESPONSE.LEAVE_BALANCE.FETCHED,

        data:
        balance

    });

}

catch(error){

     next(error);

}

};


// ================= UPDATE BALANCE =================
const updateBalance = async(req, res, next)=>{

try{

    const employee_id =
    parseInt(
    req.params.employee_id
    );

    const {
        leave_days
    } = req.body;


    if(
        isNaN(employee_id)
    ){
        logger.warn(
            `Invalid employee id: ${req.params.employee_id}`
        );

        return res
        .status(400)
        .json({

            message:
            RESPONSE.LEAVE_BALANCE.INVALID_EMPLOYEE_ID

        });

    }


    if(
        leave_days === undefined
    ){
        logger.warn(
            "Balance update attempted without leave_days"
        );

        return res
        .status(400)
        .json({

            message:
            RESPONSE.LEAVE_BALANCE.LEAVE_DAYS_REQUIRED

        });

    }


    const updated =
    await model
    .updateBalance(

        employee_id,

        leave_days

    );


    if(
        !updated
    ){

        return res
        .status(404)
        .json({

            message:
            RESPONSE.LEAVE_BALANCE.NOT_FOUND

        });

    }

    audit(
        `Balance updated: Employee ${employee_id}, Days ${leave_days}`
    );


    res.status(200)
    .json({

        message:
        RESPONSE.LEAVE_BALANCE.UPDATED,

        data:
        updated

    });

}

catch(error){

     next(error);

}

};


module.exports={

getBalance,
updateBalance

};
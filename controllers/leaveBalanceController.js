const model =
require(
"../models/leaveBalanceModel"
);


// ================= GET BALANCE =================
const getBalance =
async (
req,
res
)=>{

try{

    const employee_id =
    parseInt(
    req.params.employee_id
    );

    if(
    isNaN(
    employee_id
    )
    ){

        return res
        .status(400)
        .json({

            message:
            "Invalid employee id"

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
        "Leave balance fetched",

        data:
        balance

    });

}

catch(error){

    res.status(500)
    .json({

        message:
        "Server error",

        error:
        error.message

    });

}

};


// ================= UPDATE BALANCE =================
const updateBalance =
async(
req,
res
)=>{

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

        return res
        .status(400)
        .json({

            message:
            "Invalid employee id"

        });

    }


    if(
    leave_days === undefined
    ){

        return res
        .status(400)
        .json({

            message:
            "leave_days required"

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
            "Balance record not found"

        });

    }


    res.status(200)
    .json({

        message:
        "Balance updated",

        data:
        updated

    });

}

catch(error){

    res.status(500)
    .json({

        message:
        "Server error",

        error:
        error.message

    });

}

};


module.exports={

getBalance,
updateBalance

};
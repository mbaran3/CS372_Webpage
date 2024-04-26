function checkPassword (pass){
    console.log(pass)
    if(pass.length>=9) {
        var dot = false;
        var special= false;
        var cap= false;
        var low= false;
        var num= false;
        for(let i=0; i<pass.length;i++) {
            if ((pass.charAt(i)>="!"&&pass.charAt(i)<="/")||(pass.charAt(i)>=":"&&pass.charAt(i)<="@")
                ||(pass.charAt(i)>="["&&pass.charAt(i)<="'")||(pass.charAt(i)>="{"&&pass.charAt(i)<="~"))
                special = true;
            if (pass.charAt(i)!=".")
                dot = true;
            if (pass.charAt(i)>="a" && pass.charAt(i)<="z")
                low = true;
            if (pass.charAt(i)>="A" && pass.charAt(i)<="Z")
                cap = true;
            if (pass.charAt(i)>="0" && pass.charAt(i)<="9")
                num = true;
        }
        if(!(special&&dot&&low&&cap&&num))
            return { isValid: false,  message: "Error: Password Does Not Meet Requirements" };
    }else{
        return {isValid: false, message: "Error: The password but be atleast 9 Characters"}
    }   
    return {isValid: true,  message: "The password is valid"}
}
function checkUserID(userID){
		if(userID.length>=4) {
			var bool = false;
			for(let i=0; i<userID.length;i++) {
				if (userID.charAt(i)!="_"&&(userID.charAt(i)<"a"||userID.charAt(i)>"z"))
                        return {isValid:false, message:"Error: Username Can Only Contain Lower Case and Underscores"}
            }
            return {isValid: true, message: ""}
        }
        else{
			return {isValid: false, message: "Error: Username Must be 4 or More Characters"}
        }
}

module.exports = {
    checkPassword,
    checkUserID
}

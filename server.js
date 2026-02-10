require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Email
const OFFICIAL_EMAIL = "aadityendra1004.be23@chitkarauniversity.edu.in";

// Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });


// ---------------- HELPERS ----------------

// Fibonacci
function getFibonacci(n){
    let arr=[0,1];
    for(let i=2;i<=n;i++){
        arr[i]=arr[i-1]+arr[i-2];
    }
    return arr.slice(0,n+1);
}

// Prime
function isPrime(n){
    if(n<2) return false;
    for(let i=2;i*i<=n;i++){
        if(n%i===0) return false;
    }
    return true;
}

// GCD
function gcd(a,b){
    return b===0?a:gcd(b,a%b);
}

// LCM
function lcm(a,b){
    return (a*b)/gcd(a,b);
}


// ---------------- ROUTES ----------------

// Health
app.get("/health",(req,res)=>{
    res.json({
        is_success:true,
        official_email:OFFICIAL_EMAIL
    });
});


// BFHL
app.post("/bfhl", async (req,res)=>{
    try{
        console.log("BODY:",req.body);

        const body=req.body;

        if(!body || Object.keys(body).length!==1){
            return res.status(400).json({
                is_success:false,
                official_email:OFFICIAL_EMAIL
            });
        }

        let result;

        if(body.fibonacci!==undefined){
            const n=Number(body.fibonacci);
            if(isNaN(n)) throw new Error("Invalid number");
            result=getFibonacci(n);
        }

        else if(body.prime){
            if(!Array.isArray(body.prime)) throw new Error("Invalid array");
            result=body.prime.filter(isPrime);
        }

        else if(body.lcm){
            if(!Array.isArray(body.lcm)) throw new Error("Invalid array");
            result=body.lcm.reduce((a,b)=>lcm(a,b));
        }

        else if(body.hcf){
            if(!Array.isArray(body.hcf)) throw new Error("Invalid array");
            result=body.hcf.reduce((a,b)=>gcd(a,b));
        }

        else if(body.AI){
            const prompt=`Answer in one word: ${body.AI}`;
            const ai=await model.generateContent(prompt);
            const text=await ai.response.text();
            result=text.trim().split(" ")[0];
        }

        else{
            throw new Error("Invalid key");
        }

        res.json({
            is_success:true,
            official_email:OFFICIAL_EMAIL,
            data:result
        });

    }catch(err){
        res.status(400).json({
            is_success:false,
            official_email:OFFICIAL_EMAIL,
            message:err.message
        });
    }
});


// Start
const PORT=3000;
app.listen(PORT,()=>console.log("Running on 3000"));

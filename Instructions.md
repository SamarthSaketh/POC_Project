**DATASET**

**ACTION** : Create a table with name **GeneralInformation** in a database named as **testdb** with the below schema in SQL Server Mnagement Studio using localhost sever.



**Table Schema:**

CREATE TABLE testdb.dbo.GeneralInformation (

&nbsp;   --RecordID will now auto-increment starting at 1, increasing by 1

&nbsp;   RecordID INT IDENTITY(1,1) PRIMARY KEY, 

&nbsp;   Originator VARCHAR(100),

&nbsp;   Title VARCHAR(255),

&nbsp;   OriginalDateDue DATE, -- Assuming DATE type for YYYY-MM-DD format

&nbsp;   DateOpened DATE,

&nbsp;   DateDue DATE,

&nbsp;   QualityApprover VARCHAR(100),

&nbsp;   QualityReviewer VARCHAR(100),

&nbsp;   SupervisorManager VARCHAR(100),

&nbsp;   Description NVARCHAR(MAX),

&nbsp;   BatchNo VARCHAR(50)

);



**BACKEND (Flask API):**



**Prerequisites:** Install all required Python packages

-> pip install pyodbc

-> pip install flask

-> pip install flask-cors



**Run Command:** Run the backend code in a separate terminal using the command

->python app\_backend.py





**FRONTEND (React/Vite)**



**Setup:** In the frontend directory, run

->npm install



**Run Command:** Run the development server

-> npm run dev



The Result will confirm that the Vite development server is active and serving React UI at http://localhost:5173/.




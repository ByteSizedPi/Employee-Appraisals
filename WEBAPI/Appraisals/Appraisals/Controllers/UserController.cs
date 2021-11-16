using Appraisals.Models;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Cors;

namespace Appraisals.Controllers
{
    public class UserController : ApiController
    {
        [HttpGet]
        [Route("api/username")]
        public HttpResponseMessage GetUserByUsername(string username)
        {
            string query = @"SELECT username
                    FROM dbo.Users
                    WHERE username='" + username + @"'
                    AND NOT department='disabled'";

            DataTable table = this.executeQuery(query);
            return Request.CreateResponse(HttpStatusCode.OK, table);
        }

        [HttpGet]
        [Route("api/login")]
        public HttpResponseMessage Login(string username, string password)
        {
            string query = @"SELECT *
                    FROM dbo.Users
                    WHERE username='" + username + @"'
                    AND password='" + password + @"'
                    AND NOT department='disabled'";
            DataTable table = this.executeQuery(query);
            return Request.CreateResponse(HttpStatusCode.OK, table);
        }

        [Authorize]
        [HttpGet]
        [Route("api/users")]
        public HttpResponseMessage Get()
        {
            string query = @"SELECT * FROM dbo.Users";
            DataTable table = this.executeQuery(query);
            return Request.CreateResponse(HttpStatusCode.OK, table);
        }

        [HttpGet]
        [Authorize]
        [Route("api/manager")]
        public HttpResponseMessage GetManager(string department)
        {
            string query = @"SELECT * FROM dbo.Users WHERE department='" + department + @"' AND rank='manager'";
            DataTable table = this.executeQuery(query);
            return Request.CreateResponse(HttpStatusCode.OK, table);
        }

        [HttpGet]
        [Authorize]
        [Route("api/departments")]
        public HttpResponseMessage GetDepartments()
        {
            string query = @"SELECT DISTINCT department
                            FROM dbo.Users 
                            WHERE NOT department='none' 
                            AND NOT department='disabled'";
            DataTable table = this.executeQuery(query);
            return Request.CreateResponse(HttpStatusCode.OK, table);
        }

        [HttpPost]
        [Authorize]
        [Route("api/newuser")]
        public string Post(Users user)
        {
            try
            {
                string query = @"
                INSERT INTO dbo.Users VALUES
                ('" + user.username + @"', '" +
                user.name + @"', '" +
                user.password + @"', '" +
                user.department + @"', '" +
                user.rank + @"', '" +
                user.date_created + @"')";

                this.executeQuery(query);
                return "Added User Successfully";
            }
            catch (Exception e)
            {
                return e.ToString();
            }
        }

        [HttpPut]
        [Authorize]
        [Route("api/removeuser")]
        public string RemoveUser(string username)
        {
            string query = @"UPDATE dbo.Users SET department= 'disabled'
                            WHERE username='" + username + @"'";
            try
            {
                this.executeQuery(query);
                return "Removed User Successfully";
            }
            catch (Exception)
            {
                return "Failed to remove User";
            }
        }

        [HttpPut]
        [Authorize]
        [Route("api/updatepassword")]
        public string UpdatePassword(string username, string password)
        {
            string query = @"update dbo.Users SET password=
                            '" + password + @"'
                            WHERE username='" + username + @"'";
            try
            {
                this.executeQuery(query);
                return "Updated Password Successfully";
            }
            catch (Exception)
            {
                return "Failed to Update Password";
            }
        }

        private DataTable executeQuery(string query)
        {
            DataTable table = new DataTable();
            using (var con = new SqlConnection(ConfigurationManager.
                ConnectionStrings["dbEmployeeAppraisals"].ConnectionString))
            using (var cmd = new SqlCommand(query, con))
            using (var da = new SqlDataAdapter(cmd))
            {
                cmd.CommandType = CommandType.Text;
                da.Fill(table);
            }
            return table;
        }
    }
}

package com.resumebuilder.servlets;

import com.resumebuilder.utils.DBConnection;
import java.io.*;
import java.sql.*;
import jakarta.servlet.*;
import jakarta.servlet.http.*;
import jakarta.servlet.annotation.*;

@WebServlet("/api/experience")
public class ExperienceServlet extends HttpServlet {

    protected void doOptions(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        response.setHeader("Access-Control-Allow-Origin", "*");
        response.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
        response.setHeader("Access-Control-Allow-Headers", "Content-Type");
        response.setStatus(200);
    }

    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        response.setContentType("application/json");
        response.setHeader("Access-Control-Allow-Origin", "*");

        String userId = request.getParameter("userId");

        try (Connection conn = DBConnection.getConnection()) {
            String sql = "SELECT company, role, year_start, year_end, description FROM experience WHERE user_id=?";
            PreparedStatement ps = conn.prepareStatement(sql);
            ps.setInt(1, Integer.parseInt(userId));
            ResultSet rs = ps.executeQuery();

            StringBuilder json = new StringBuilder("[");
            boolean first = true;
            while (rs.next()) {
                if (!first) json.append(",");
                json.append("{")
                    .append("\"company\":\"").append(rs.getString("company")).append("\",")
                    .append("\"role\":\"").append(rs.getString("role")).append("\",")
                    .append("\"year_start\":\"").append(rs.getString("year_start")).append("\",")
                    .append("\"year_end\":\"").append(rs.getString("year_end")).append("\",")
                    .append("\"description\":\"").append(rs.getString("description") != null ? rs.getString("description").replace("\"", "'") : "").append("\"")
                    .append("}");
                first = false;
            }
            json.append("]");
            response.getWriter().write(json.toString());
        } catch (SQLException e) {
            response.getWriter().write("[]");
        }
    }

    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        response.setContentType("application/json");
        response.setHeader("Access-Control-Allow-Origin", "*");

        StringBuilder sb = new StringBuilder();
        BufferedReader reader = request.getReader();
        String line;
        while ((line = reader.readLine()) != null) sb.append(line);
        String body = sb.toString();

        String userId = extractValue(body, "userId");
        String company = extractValue(body, "company");
        String role = extractValue(body, "role");
        String yearStart = extractValue(body, "yearStart");
        String yearEnd = extractValue(body, "yearEnd");
        String description = extractValue(body, "description");

        try (Connection conn = DBConnection.getConnection()) {
            String sql = "INSERT INTO experience(user_id, company, role, year_start, year_end, description) VALUES(?,?,?,?,?,?)";
            PreparedStatement ps = conn.prepareStatement(sql);
            ps.setInt(1, Integer.parseInt(userId));
            ps.setString(2, company);
            ps.setString(3, role);
            ps.setInt(4, Integer.parseInt(yearStart));
            ps.setInt(5, Integer.parseInt(yearEnd));
            ps.setString(6, description);
            ps.executeUpdate();
            response.getWriter().write("{\"success\":true}");
        } catch (SQLException e) {
            response.getWriter().write("{\"success\":false,\"error\":\"" + e.getMessage() + "\"}");
        }
    }

    private String extractValue(String json, String key) {
        String search = "\"" + key + "\":\"";
        int start = json.indexOf(search);
        if (start == -1) return null;
        start += search.length();
        int end = json.indexOf("\"", start);
        return json.substring(start, end);
    }
}
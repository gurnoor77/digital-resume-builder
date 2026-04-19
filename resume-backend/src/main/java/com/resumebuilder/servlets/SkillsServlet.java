package com.resumebuilder.servlets;

import com.resumebuilder.utils.DBConnection;
import java.io.*;
import java.sql.*;
import jakarta.servlet.*;
import jakarta.servlet.http.*;
import jakarta.servlet.annotation.*;

@WebServlet("/api/skills")
public class SkillsServlet extends HttpServlet {

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
            String sql = "SELECT skill_name, level FROM skills WHERE user_id=?";
            PreparedStatement ps = conn.prepareStatement(sql);
            ps.setInt(1, Integer.parseInt(userId));
            ResultSet rs = ps.executeQuery();

            StringBuilder json = new StringBuilder("[");
            boolean first = true;
            while (rs.next()) {
                if (!first) json.append(",");
                json.append("{\"skill_name\":\"").append(rs.getString("skill_name"))
                    .append("\",\"level\":\"").append(rs.getString("level")).append("\"}");
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
        String skillName = extractValue(body, "skillName");
        String level = extractValue(body, "level");

        try (Connection conn = DBConnection.getConnection()) {
            String sql = "INSERT INTO skills(user_id, skill_name, level) VALUES(?,?,?)";
            PreparedStatement ps = conn.prepareStatement(sql);
            ps.setInt(1, Integer.parseInt(userId));
            ps.setString(2, skillName);
            ps.setString(3, level);
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
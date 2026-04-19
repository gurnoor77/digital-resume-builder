package com.resumebuilder.servlets;

import com.resumebuilder.utils.DBConnection;
import java.io.*;
import java.sql.*;
import jakarta.servlet.*;
import jakarta.servlet.http.*;
import jakarta.servlet.annotation.*;

@WebServlet("/api/profile")
public class ProfileServlet extends HttpServlet {

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
            String sql = "SELECT u.name, u.email, p.phone, p.address, p.linkedin, p.github " +
                        "FROM users u LEFT JOIN profiles p ON u.id = p.user_id " +
                        "WHERE u.id = ?";
            PreparedStatement ps = conn.prepareStatement(sql);
            ps.setInt(1, Integer.parseInt(userId));
            ResultSet rs = ps.executeQuery();

            if (rs.next()) {
                String json = "{" +
                    "\"name\":\"" + rs.getString("name") + "\"," +
                    "\"email\":\"" + rs.getString("email") + "\"," +
                    "\"phone\":\"" + (rs.getString("phone") != null ? rs.getString("phone") : "") + "\"," +
                    "\"address\":\"" + (rs.getString("address") != null ? rs.getString("address") : "") + "\"," +
                    "\"linkedin\":\"" + (rs.getString("linkedin") != null ? rs.getString("linkedin") : "") + "\"," +
                    "\"github\":\"" + (rs.getString("github") != null ? rs.getString("github") : "") + "\"" +
                    "}";
                response.getWriter().write(json);
            } else {
                response.getWriter().write("{\"success\":false,\"message\":\"User not found\"}");
            }
        } catch (SQLException e) {
            response.getWriter().write("{\"success\":false,\"error\":\"" + e.getMessage() + "\"}");
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
        String phone = extractValue(body, "phone");
        String address = extractValue(body, "address");
        String linkedin = extractValue(body, "linkedin");
        String github = extractValue(body, "github");

        try (Connection conn = DBConnection.getConnection()) {
            String sql = "INSERT INTO profiles(user_id, phone, address, linkedin, github) " +
                        "VALUES(?,?,?,?,?) ON DUPLICATE KEY UPDATE " +
                        "phone=?, address=?, linkedin=?, github=?";
            PreparedStatement ps = conn.prepareStatement(sql);
            ps.setInt(1, Integer.parseInt(userId));
            ps.setString(2, phone);
            ps.setString(3, address);
            ps.setString(4, linkedin);
            ps.setString(5, github);
            ps.setString(6, phone);
            ps.setString(7, address);
            ps.setString(8, linkedin);
            ps.setString(9, github);
            ps.executeUpdate();
            response.getWriter().write("{\"success\":true,\"message\":\"Profile saved\"}");
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
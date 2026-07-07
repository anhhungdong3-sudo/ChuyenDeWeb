package com.exam.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class RevenueStatsResponse {
    private Double todayRevenue;
    private Double monthRevenue;
    private Double yearRevenue;
    private Long deliveredOrders;
    private Long booksSold;
    private List<DailyRevenue> dailyRevenue;
    private List<CategoryRevenue> categoryRevenue;

    @Data
    @AllArgsConstructor
    public static class DailyRevenue {
        private String date;
        private String label;
        private Double revenue;
        private Long orders;
    }

    @Data
    @AllArgsConstructor
    public static class CategoryRevenue {
        private String name;
        private Double revenue;
        private Long booksSold;
        private Double percentage;
    }
}

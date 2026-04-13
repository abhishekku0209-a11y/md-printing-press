import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface ContentBlock {
    key: string;
    value: string;
    updatedAt: bigint;
}
export interface Service {
    id: bigint;
    displayOrder: bigint;
    icon: string;
    name: string;
    description: string;
    isActive: boolean;
    imageUrl?: string;
}
export interface CreateQuoteInput {
    serviceType: string;
    name: string;
    email: string;
    phone: string;
    budgetRange: string;
    projectDetails: string;
    timeline: string;
}
export interface CreateServiceInput {
    displayOrder: bigint;
    icon: string;
    name: string;
    description: string;
    isActive: boolean;
    imageUrl?: string;
}
export interface Order {
    id: bigint;
    status: OrderStatus;
    serviceType: string;
    clientName: string;
    createdAt: bigint;
    quoteId?: bigint;
    description: string;
    updatedAt: bigint;
    amount: number;
}
export interface CreateTestimonialInput {
    clientName: string;
    displayOrder: bigint;
    businessType: string;
    quote: string;
    isVisible: boolean;
    rating: bigint;
}
export interface CreatePortfolioItemInput {
    title: string;
    serviceCategory: string;
    displayOrder: bigint;
    imageUrl: string;
    isVisible: boolean;
}
export interface PortfolioItem {
    id: bigint;
    title: string;
    serviceCategory: string;
    displayOrder: bigint;
    imageUrl: string;
    isVisible: boolean;
}
export interface CreateOrderInput {
    serviceType: string;
    clientName: string;
    quoteId?: bigint;
    description: string;
    amount: number;
}
export interface Quote {
    id: bigint;
    status: QuoteStatus;
    serviceType: string;
    name: string;
    createdAt: bigint;
    email: string;
    phone: string;
    budgetRange: string;
    projectDetails: string;
    timeline: string;
}
export interface Testimonial {
    id: bigint;
    clientName: string;
    displayOrder: bigint;
    businessType: string;
    quote: string;
    isVisible: boolean;
    rating: bigint;
}
export enum OrderStatus {
    Delivered = "Delivered",
    Ready = "Ready",
    InProgress = "InProgress",
    Pending = "Pending"
}
export enum QuoteStatus {
    New = "New",
    Won = "Won",
    Lost = "Lost",
    Contacted = "Contacted"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createOrder(input: CreateOrderInput): Promise<Order>;
    createPortfolioItem(input: CreatePortfolioItemInput): Promise<PortfolioItem>;
    createQuote(input: CreateQuoteInput): Promise<Quote>;
    createService(input: CreateServiceInput): Promise<Service>;
    createTestimonial(input: CreateTestimonialInput): Promise<Testimonial>;
    deletePortfolioItem(id: bigint): Promise<boolean>;
    deleteService(id: bigint): Promise<boolean>;
    deleteTestimonial(id: bigint): Promise<boolean>;
    getAllOrders(): Promise<Array<Order>>;
    getAllQuotes(): Promise<Array<Quote>>;
    getCallerUserRole(): Promise<UserRole>;
    getContentBlock(key: string): Promise<ContentBlock | null>;
    getContentBlocks(): Promise<Array<ContentBlock>>;
    getOrder(id: bigint): Promise<Order | null>;
    getPortfolioItems(): Promise<Array<PortfolioItem>>;
    getQuote(id: bigint): Promise<Quote | null>;
    getServices(): Promise<Array<Service>>;
    getTestimonials(): Promise<Array<Testimonial>>;
    isCallerAdmin(): Promise<boolean>;
    setContentBlock(key: string, value: string): Promise<void>;
    updateOrderStatus(id: bigint, status: OrderStatus): Promise<boolean>;
    updatePortfolioItem(id: bigint, input: CreatePortfolioItemInput): Promise<boolean>;
    updateQuoteStatus(id: bigint, status: QuoteStatus): Promise<boolean>;
    updateService(id: bigint, input: CreateServiceInput): Promise<boolean>;
    updateTestimonial(id: bigint, input: CreateTestimonialInput): Promise<boolean>;
    verifyAdminCredentials(id: string, password: string): Promise<boolean>;
}
